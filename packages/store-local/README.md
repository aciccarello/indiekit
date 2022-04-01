# @indiekit/store-local

Store IndieWeb content to the local filesystem. Useful for local testing.

## Installation

`npm i @indiekit/store-local`

## Usage

Add `@indiekit/store-local` to your list of plugins, specifying options as required:

```json
{
  "plugins": ["@indiekit/store-local"],
  "@indiekit/store-local": {
    "directory": "../project"
  }
}
```

## Options

| Option      | Type     | Description                                                            |
| :---------- | :------- | :--------------------------------------------------------------------- |
| `directory` | `string` | Directory to save files to.                                            |
