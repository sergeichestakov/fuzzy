interface MatchOptions {
  pre?: string;
  post?: string;
  caseSensitive?: boolean;
}

interface MatchResult {
  rendered: string;
  score: number;
}

interface ExtractCallback<T> {
  (input: T): string;
}

interface FilterOptions<T> {
  pre?: string;
  post?: string;
  extract?: ExtractCallback<T>;
}

export interface FilterResult<T> {
  string: string;
  score: number;
  index: number;
  original: T;
}

function extractString<T>(element: T, options: FilterOptions<T>): string {
  if (typeof element === "string") {
    return element;
  }

  return options.extract!(element);
}

/**
 * Return all elements of `array` that have a fuzzy match against `pattern`.
 */
function simpleFilter(pattern: string, array: string[]): string[] {
  return array.filter(function (str) {
    return test(pattern, str);
  });
}

/**
 * Does `pattern` fuzzy match `inputString`?
 */
function test(pattern: string, inputString: string): boolean {
  return match(pattern, inputString) !== null;
}

/**
 * If `pattern` matches `inputString`, wrap each matching character in `opts.pre`
 * and `opts.post`. If no match, return null.
 */
function match(
  inputPattern: string,
  inputString: string,
  opts?: MatchOptions
): MatchResult | null {
  const options = opts || {};
  const result = [];
  const len = inputString.length;
  const pre = options.pre || "";
  const post = options.post || "";

  // String to compare against. This might be a lowercase version of the
  // raw string
  const compareString =
    (options.caseSensitive && inputString) || inputString.toLowerCase();
  const pattern =
    (options.caseSensitive && inputPattern) || inputPattern.toLowerCase();

  let ch;

  let patternIdx = 0;
  let totalScore = 0;
  let currScore = 0;

  // For each character in the string, either add it to the result
  // or wrap in template if it's the next string in the pattern
  for (let idx = 0; idx < len; idx++) {
    ch = inputString[idx];
    if (compareString[idx] === pattern[patternIdx]) {
      ch = pre + ch + post;
      patternIdx += 1;

      // consecutive characters should increase the score more than linearly
      currScore += 1 + currScore;
    } else {
      currScore = 0;
    }
    totalScore += currScore;
    result[result.length] = ch;
  }

  // return rendered string if we have a match for every char
  if (patternIdx === pattern.length) {
    // if the string is an exact match with pattern, totalScore should be maxed
    totalScore = compareString === pattern ? Infinity : totalScore;
    return { rendered: result.join(""), score: totalScore };
  }

  return null;
}

/**
 * The normal entry point. Filters `arr` for matches against `pattern`.
 */
function filter<T>(
  pattern: string,
  arr: T[],
  opts?: FilterOptions<T>
): FilterResult<T>[] {
  if (arr.length === 0) {
    return [];
  }

  const options = opts || {};

  const result: FilterResult<T>[] = [];
  arr.forEach((element, index) => {
    const str = extractString(element, options);

    const rendered = match(pattern, str, options);
    if (rendered !== null) {
      result.push({
        string: rendered.rendered,
        score: rendered.score,
        index,
        original: element,
      });
    }
  });
  // Sort by score. Browsers are inconsistent wrt stable/unstable
  // sorting, so force stable by using the index in the case of tie.
  // See http://ofb.net/~sethml/is-sort-stable.html
  result.sort(function (a, b) {
    const compare = b.score - a.score;
    if (compare) return compare;
    return a.index - b.index;
  });

  return result;
}

export default {
  simpleFilter,
  filter,
  match,
  test,
};
