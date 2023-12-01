# Coding Takehome

## Getting the project running

```bash
# Fork this project, then clone your fork
git clone https://github.com/...

cd anvil-coding-challenge

# Install dependencies
yarn

# Start development server
yarn dev

# Visit http://localhost:3000

# Run the linter, server tests, and client tests
yarn test
```

Other helpful things

```bash
yarn lint # Only the linter
yarn test:server # Only the server tests
yarn test:client # Only the client tests

yarn db:reset # Reset the DB to the initial seed data
```

## What even is it?

It's a single page app that shows a list of files.

<img width="669" alt="Screen Shot 2020-05-07 at 12 28 14 PM" src="https://user-images.githubusercontent.com/69169/81336579-71df3300-905e-11ea-888a-acccc1344b36.png">

You can add new files!

<img width="636" alt="Screen Shot 2020-05-07 at 12 30 03 PM" src="https://user-images.githubusercontent.com/69169/81336645-8cb1a780-905e-11ea-86ce-f882a2d5fd46.png">

That's all it does without your help!

## Task
1) Search/Filter
- Add a search box to the top of the list of files. 
- The list of files should filter as you type
- A query param should update as you type. e.g. localhost:3000/?q=elvis
- Navigating to the page with a query param should search the file list on load

2) Filename De-duplication
- The coding challenge application allows you to upload multiple files with the same filename. The goal is to fix this. When someone uploads a file with a duplicate filename in the DB, rewrite the new filename to a filename with a unique identifier.
  - If unicorns.png is uploaded and it already exists in the database, it should rewrite to unicorns(1).png. 
  - It should count up and fill any gaps. e.g. unicorns.png is uploaded and [‘unicorns.png’, ‘unicorns(1).png’, ‘unicorns(3).png’, ‘unicorns(5).png’] exist, the next names would contain (2), (4), (6), (7), etc.
  - Shoot for simplicity, the main goal is just that there are no dupes in the db!
