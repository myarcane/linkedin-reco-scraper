export type Recommendation = {
  readonly name: string
  readonly link: string
  readonly content: string
}

export type SavingOptions = {
  readonly githubOwner?: string
  readonly githubRepo?: string
  readonly githubEmail?: string
  readonly githubToken?: string
  readonly path?: string
}
