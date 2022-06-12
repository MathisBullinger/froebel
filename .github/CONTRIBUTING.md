# Contributing to Froebel

Contributions are always welcome. Before considering making a contribution
please take a moment to read the guidelines in this document.

## Feature Requests

Feature requests should be submitted in the [issue tracker](https://github.com/MathisBullinger/froebel/issues).
Please describe the expected behavior of the utility and what problem it solves.

## Pull Requests

Before opening a pull request for a new utility, please make sure that an issue
has been opened discussing its inclusion.

Every utility must have a unit test. If the utility is in the file `myNewUtility.ts`,
the tests must be in a file named `myNewUtility.test.ts`.

The utilities are grouped into categories: `function`, `list`, `iterable`, 
`object`, `path`, `equality`, `promise`, `predicate`, `string`, `math`, 
and `ds` (data structures). Each category has a file by the same name. Every
utility must be exported from at least one of those files.

The readme is generated from those exports and their JSDoc comments. Every 
utility should have at a minimum a short description 
(``/** Utility transforms `a`, `b`, `c` into `d`... */``) and ideally should 
also have at least one example.

Always regenerate the readme after making changes to the code by running 
`scripts/docs`. Before running that scripts, you will need to run `npm install`
inside the `npm` directory.

The code is formatted using the built-in Deno formatter (`deno fmt *.ts`).

Every utility must work in Deno, Node, and (modern) Browsers.
