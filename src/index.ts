#!/usr/bin/env node

import { Command } from 'commander'
import { getLinkedinRecommendations } from './scraper.js'
import { saveRecommendationsToGithub } from './services/github.js'
import { SavingOptions } from './models.js'
import { Spinner } from 'cli-spinner'

const spinner = new Spinner()
spinner.setSpinnerString('|/-\\')

const program = new Command()

program
  .version('0.0.1')
  .description(
    'Linkedin recommendations scrapper is a CLI to scrap linkedin recommendations from a public profile.',
  )
  .argument('<linkedin-slug-name>', 'linkedin slug name')
  .option('-s, --save', 'saves the recommendations on your github repos')
  .option('-o, --githubOwner <github-owner>', 'github owner')
  .option('-r, --githubRepo <github-repo>', 'github repo')
  .option('-t, --githubToken <github-token>', 'github token')
  .option('-e, --githubEmail <github-email>', 'github email')
  .option('-p, --path <path-to-json-file>', 'path to save the json file')
  .action(
    async (
      slugName: string,
      opts: SavingOptions & { readonly save?: boolean },
    ) => {
      try {
        spinner.start()
        spinner.setSpinnerTitle(
          '%s Starting linkedin recommendations scraper...',
        )
        const recommendations = await getLinkedinRecommendations(slugName)
        spinner.stop(true)
        console.log(recommendations)

        const {
          save,
          githubOwner,
          githubRepo,
          githubEmail,
          path = 'linkedin-recommendations.json',
          githubToken = process.env.GITHUB_TOKEN,
        } = opts

        if (save && githubOwner && githubRepo && githubEmail) {
          spinner.start()
          spinner.setSpinnerTitle('%s Saving recommendations to github...')
          const response = await saveRecommendationsToGithub(
            JSON.stringify(recommendations),
            message => {
              spinner.setSpinnerTitle(`%s ${message}`)
            },
            {
              githubOwner,
              githubRepo,
              githubEmail,
              githubToken,
              path,
            },
          )

          if (response.status === 200 || response.status === 201) {
            spinner.stop(true)
            console.log('Recommendations saved successfully!')
          }
        }
      } catch (error) {
        spinner.stop(true)
        console.log(error.message)
      }

      spinner.stop(true)
      process.exit(0)
    },
  )
  .parse(process.argv)
