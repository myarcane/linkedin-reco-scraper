import { Octokit } from '@octokit/rest'
import { SavingOptions } from '../models.js'
import { Base64 } from 'js-base64'

export const saveRecommendationsToGithub = async (
  linkedinRecommendations: string,
  log: (message: string) => void,
  {
    githubEmail,
    githubOwner,
    githubRepo,
    githubToken,
    path,
  }: Required<SavingOptions>,
) => {
  const octokit = new Octokit({
    auth: githubToken,
  })

  let sha = ''
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: githubOwner,
      repo: githubRepo,
      path: path,
    })

    sha = (data as any).sha
  } catch (error) {
    if (error.status === 404) {
      log("File does not exist yet on github, let's create it!")
    }
  }

  const response = await octokit.repos.createOrUpdateFileContents({
    owner: githubOwner,
    repo: githubRepo,
    path: path,
    sha,
    message: 'Save linkedin recommendations programmatically',
    content: Base64.encode(linkedinRecommendations),
    committer: {
      name: githubOwner,
      email: githubEmail,
    },
    author: {
      name: githubOwner,
      email: githubEmail,
    },
  })

  return response
}
