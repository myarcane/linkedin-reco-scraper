<div align="center">
<h1><strong>linkedin-reco-sraper</strong></h1>

A small CLI tool to be able to extract my LinkedIn recommendations

![demo](./docs/demo.gif)

</div>

## Why this CLI?

I wanted to be able to display my LinkedIn recommendations on my personal website without having to copy paste them manually from Linkedin.

At first, I thought LinkedIn would provide an API to be able to easily fetch them but sadly since 2015 you need an explicit approval from their end to access their API. 

So, I decided to build a small scraper to get these data directly from their web pages and send these data to my static web site. Currently the extraction is done with puppeteer launching a chrome headless browser in private mode. As of November 2023 the scraping works for me.

I also tried with different LinkedIn profiles and I am also able to retrieve their recommendations if they have some of course but also if they made them public. 

After multiple scraping, LinkedIn might block the current ip adress and redirect the original browser request to the signin page. I've personally used a VPN to work around that.    

## Installation

```bash
$ npm i && npm run build
```

CLI can also be installed globally adding

```bash
$ npm install -g .
```

## Commands

```bash
$ linkedin-reco-sraper <linkedin-slug-name>
```

Scrape linkedin recommendations __if available__ and output them. 

#### Options

- `-s --saveToGithub` - saves the recommendations on your github repos
- `-r --githubRepo` - github repo.
- `-o --githubOwner` - github owner.
- `-e --githubEmail` - github email.
- `-t --githubToken` - github token.
- `-e --githubEmail` - github email.
- `-p --path` - path to save the json file.

