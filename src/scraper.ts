import puppeteer, { Browser } from 'puppeteer'
import { LINKEDIN_URL, BROWSER_ARGS, HTTP_HEADERS } from './constants.js'
import { Recommendation } from './models.js'

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: BROWSER_ARGS,
  })
  const page = await browser.newPage()

  // set extra headers to "try" to avoid bot detection.
  page.setExtraHTTPHeaders(HTTP_HEADERS)

  return { browser, page }
}

const getRecommenderCurrentJobTitle = async (
  browser: Browser,
  recommenderUrl: string,
): Promise<string> => {
  const page = await browser.newPage()
  await page.goto(recommenderUrl, {
    waitUntil: 'networkidle2',
  })

  await page.bringToFront()

  const recommenderCurrentTitle = await page.$$eval(
    '[class^="top-card-layout__headline"]',
    el => el.map(x => x.textContent.trim().replace(/\n/g, '')),
  )

  return recommenderCurrentTitle[0]
}

export const getLinkedinRecommendations = async (
  slugName: string,
): Promise<Recommendation[]> => {
  const { browser, page } = await startBrowser()

  page.setViewport({ width: 1366, height: 768 })

  await page.goto(`${LINKEDIN_URL}${slugName}`, {
    waitUntil: 'networkidle2',
  })

  const recommendersName = await page.$$eval(
    '[class^="endorsement-card"] > a h3',
    el => el.map(x => x.textContent.trim()),
  )

  const recommendationsContent = await page.$$eval(
    '[class^="endorsement-card__content"]',
    el => el.map(x => x.textContent.trim().replace(/\n/g, '')),
  )

  const recommendersLinkProfile = await page.$$eval(
    '[class^="endorsement-card"] > a',
    el => el.map(x => x.getAttribute('href')),
  )

  if (
    recommendationsContent.length === 0 ||
    recommendationsContent.length !== recommendersLinkProfile.length ||
    recommendationsContent.length !== recommendersName.length
  ) {
    throw new Error(
      `We are encountering difficulties in retrieving received recommendations, and there could be several underlying reasons:
         - There may be simply no public recommendations for this profile.
         - LinkedIn may have blocked your IP address. We recommend using a VPN before initiating the scraping process.
         - LinkedIn might have altered the page layout, necessitating changes to the selectors.
        `,
    )
  }

  const recommendersTitle = await recommendersLinkProfile.reduce(
    async (acc, linkProfile) => {
      const recommenderTitle = await getRecommenderCurrentJobTitle(
        browser,
        linkProfile,
      )
      return [...(await acc), recommenderTitle]
    },
    Promise.resolve([]),
  )

  await browser.close()

  return recommendationsContent.map((content, index) => {
    return {
      name: recommendersName[index],
      link: recommendersLinkProfile[index],
      content,
      title: recommendersTitle[index] ? recommendersTitle[index] : '',
    }
  })
}
