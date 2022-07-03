import client from 'client!./client'
import server from 'server!./server'
export default {
  client,
  server
}

export interface RpgPlayer{
      showTitleScreen: () => void
      mongoId: string
}
