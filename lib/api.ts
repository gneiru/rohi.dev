import { env } from "@/env"

import { me } from "@/config/site"

import {
  LanyardResponse,
  PinnedReposResponse,
  RecentlyReadResponse,
  RecentlyWatchedResponse,
} from "./types"

export async function getPinnedRepos(): Promise<PinnedReposResponse[]> {
  const res = await fetch(
    `https://gh-pinned-repos.egoist.dev/?username=${me.tag}`,
    {
      next: { revalidate: 60 * 5 },
    }
  )
  const data = await res.json()

  return data
}

export async function recentlyWatched(): Promise<RecentlyWatchedResponse> {
  const res = await fetch(
    "https://api.myanimelist.net/v2/users/gneiru/animelist?sort=list_updated_at&fields=list_status",
    {
      headers: {
        "X-MAL-CLIENT-ID": env.MAL_CLIENT_ID,
      },
      next: { revalidate: 60 * 5 },
    }
  )
  const data = await res.json()
  return data
}

export async function recentlyRead(): Promise<RecentlyReadResponse> {
  const res = await fetch(
    "https://api.myanimelist.net/v2/users/gneiru/mangalist?sort=list_updated_at&fields=list_status",
    {
      headers: {
        "X-MAL-CLIENT-ID": env.MAL_CLIENT_ID,
      },
      next: { revalidate: 60 * 5 },
    }
  )
  const data = await res.json()
  return data
}

export async function lanyard() {
  const resp = await fetch(
    `https://api.lanyard.rest/v1/users/${me.discordID}`,
    {
      cache: "no-cache",
    }
  )
  const response = await resp.json()
  const lanyard = response.data as LanyardResponse
  return lanyard
}