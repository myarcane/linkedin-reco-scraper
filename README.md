<div align="center">
<h1><strong>linkedin-reco-scraper</strong></h1>
A small CLI tool to be able to extract my LinkedIn recommendations
![linkedin-reco-scraper (1)](https://github.com/myarcane/linkedin-reco-sraper/assets/1671293/90f15e98-04f0-4cab-a17e-c622a6f5057c)
</div>

## Why this CLI?

I wanted to showcase my LinkedIn recommendations on my personal website without the need to manually copy and paste them from LinkedIn. Initially, I believed that LinkedIn would offer an API to facilitate this process, but unfortunately, since 2015, accessing the API requires explicit approval from their end.

So, I took the initiative to develop a small scraper to directly extract this data from LinkedIn's web pages and send it to my static website. Currently, I perform the extraction using Puppeteer, launching a headless Chrome browser in private mode. As of November 2023, the scraping successfully accomplishes this task 🎉.

I've experimented with the scraper on various LinkedIn profiles and confirmed that I can fetch their recommendations as long as they have made them public.

Nevertheless, it's important to be aware that after multiple scraping attempts, LinkedIn may block the current IP address and reroute the original browser request to the sign-in page. To address this issue, I personally used a VPN before performing the scraping.

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
$ linkedin-reco-scraper <linkedin-slug-name>
```

Scrapes Linkedin recommendations **(if available)** and outputs them.

#### Options

- `-s --saveToGithub` - saves the recommendations on your github repos
- `-r --githubRepo` - github repo.
- `-o --githubOwner` - github owner.
- `-e --githubEmail` - github email.
- `-t --githubToken` - github token.
- `-e --githubEmail` - github email.
- `-p --path` - path to save the json file.
