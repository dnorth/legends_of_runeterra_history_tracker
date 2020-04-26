import React from 'react';
import { render, waitFor } from '@testing-library/react'

import TrackerDataFetcher, { CALL_FREQUENCY } from './TrackerDataFetcher'
import GameStateTypes from './game-state.types'

describe('TrackerDataFetcher', () => {
    describe('on open game', () => {
        it('should call positionalRectangles endpoint', async () => {
            const mockUrl='http://localhost:5000/api/positionalRectangles'
    
            fetch.mockResponse(req => req.url === mockUrl && Promise.resolve(JSON.stringify({ OpponentName: null, GameState: GameStateTypes.MENUS })))
    
            const wrapper = await render(
                <TrackerDataFetcher>
                    {(trackerData) => (
                        <div>{trackerData.wins}</div>
                    )}
                </TrackerDataFetcher>
            )
    
            await waitFor(() => expect(fetch.mock.calls.length).toEqual(1), { timeout: CALL_FREQUENCY + 500 })    
        })
    })
})