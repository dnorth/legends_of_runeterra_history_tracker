import React from 'react';
import { render, waitFor } from '@testing-library/react'

import TrackerDataFetcher from './TrackerDataFetcher'
import TrackerData from './TrackerData'
import GameStateTypes from './game-state.types'

describe('TrackerDataFetcher', () => {
    const TEST_POLL_FREQUENCY = 100;
    const mockPositionalUrl='http://localhost:5000/api/positionalRectangles';
    const mockDeckListUrl='http://localhost:5000/api/staticDecklist';
    const mockGameResultUrl='http://localhost:5000/api/gameResult';
    const mockDeckCode = 'ABJDSKADFS';
    const mockOpponentName = 'Swimstream';

    beforeEach(() => {
        fetch.resetMocks()
        TrackerData.history = []
    })

    describe('on open game', () => {
        it('should call positionalRectangles endpoint and render correct wins/losses', async () => {    
            fetch.mockResponses(
                [JSON.stringify({ OpponentName: null, GameState: GameStateTypes.MENUS }), { status: 200 }]
            )

            const component = await render(
                <TrackerDataFetcher pollFrequency={TEST_POLL_FREQUENCY}>
                    {(trackerData) => (
                        <div>{trackerData.wins}-{trackerData.losses}</div>
                        )}
                </TrackerDataFetcher>
            )
    
            await waitFor(() => expect(fetch.mock.calls.length).toEqual(1), { timeout: TEST_POLL_FREQUENCY + 500 })

            expect(fetch.mock.calls[0][0]).toEqual(mockPositionalUrl);

            component.getByText('0-0')
        })
    })

    describe('on player starts a match', () => {
        it('should call decklist url, create a TrackerData history record, and render correct wins/losses', async () => {

            const mockDeckCode = 'ABJDSKADFS'
            fetch.mockResponses(
                [JSON.stringify({ OpponentName: mockOpponentName, GameState: GameStateTypes.INPROGRESS }), { status: 200 }],
                [JSON.stringify({ DeckCode: mockDeckCode }), { status: 200 }],
            )

            const component = await render(
                <TrackerDataFetcher pollFrequency={TEST_POLL_FREQUENCY}>
                    {(trackerData) => (
                        <div>{trackerData.wins}-{trackerData.losses}</div>
                    )}
                </TrackerDataFetcher>
            )
    
            await waitFor(() => expect(fetch.mock.calls.length).toEqual(2), { timeout: TEST_POLL_FREQUENCY + 500 })

            expect(fetch.mock.calls[0][0]).toEqual(mockPositionalUrl);
            expect(fetch.mock.calls[1][0]).toEqual(mockDeckListUrl);

            expect(TrackerData.history.length).toEqual(1);

            component.getByText('0-0');
        })
    })

    describe('on player continues match', () => {
        it('should poll every TEST_POLL_FREQUENCY', async () => {
            const expectedPollingCount = 2;
            fetch.mockResponses(
                [JSON.stringify({ OpponentName: mockOpponentName, GameState: GameStateTypes.INPROGRESS }), { status: 200 }],
                [JSON.stringify({ DeckCode: mockDeckCode }), { status: 200 }],
                [JSON.stringify({ OpponentName: mockOpponentName, GameState: GameStateTypes.INPROGRESS }), { status: 200 }],

            )

            const component = await render(
                <TrackerDataFetcher pollFrequency={TEST_POLL_FREQUENCY}>
                    {(trackerData) => (
                        <div>{trackerData.wins}-{trackerData.losses}</div>
                    )}
                </TrackerDataFetcher>
            )
    
            await waitFor(() => expect(fetch.mock.calls.length).toEqual(3), { timeout: TEST_POLL_FREQUENCY * expectedPollingCount + 500 })

            expect(fetch.mock.calls[0][0]).toEqual(mockPositionalUrl);
            expect(fetch.mock.calls[1][0]).toEqual(mockDeckListUrl);
            expect(fetch.mock.calls[2][0]).toEqual(mockPositionalUrl);

            expect(TrackerData.history.length).toEqual(1);

            component.getByText('0-0');
        })
    })

    describe('on player ends match and local player lost', () => {
        it('should edit history record to say local player lost. Should render new score correctly.', async () => {
            const expectedPollingCount = 2;

            fetch.mockResponses(
                [JSON.stringify({ OpponentName: mockOpponentName, GameState: GameStateTypes.INPROGRESS }), { status: 200 }],
                [JSON.stringify({ DeckCode: mockDeckCode }), { status: 200 }],
                [JSON.stringify({ OpponentName: mockOpponentName, GameState: GameStateTypes.MENUS }), { status: 200 }],
                [JSON.stringify({ GameID: 0, LocalPlayerWon: false }), { status: 200 }],
            )

            const component = await render(
                <TrackerDataFetcher pollFrequency={TEST_POLL_FREQUENCY}>
                    {(trackerData) => (
                        <div>{trackerData.wins}-{trackerData.losses}</div>
                    )}
                </TrackerDataFetcher>
            )
    
            await waitFor(() => expect(fetch.mock.calls.length).toEqual(4), { timeout: TEST_POLL_FREQUENCY * expectedPollingCount + 500 })

            expect(fetch.mock.calls[0][0]).toEqual(mockPositionalUrl);
            expect(fetch.mock.calls[1][0]).toEqual(mockDeckListUrl);
            expect(fetch.mock.calls[2][0]).toEqual(mockPositionalUrl);
            expect(fetch.mock.calls[3][0]).toEqual(mockGameResultUrl);

            expect(TrackerData.history.length).toEqual(1);

            component.getByText('0-1');
        })
    })

    describe('on player ends match and local player won', () => {
        it('should edit history record to say local player won. Should render new score correctly.', async () => {
            const expectedPollingCount = 2;

            fetch.mockResponses(
                [JSON.stringify({ OpponentName: mockOpponentName, GameState: GameStateTypes.INPROGRESS }), { status: 200 }],
                [JSON.stringify({ DeckCode: mockDeckCode }), { status: 200 }],
                [JSON.stringify({ OpponentName: mockOpponentName, GameState: GameStateTypes.MENUS }), { status: 200 }],
                [JSON.stringify({ GameID: 0, LocalPlayerWon: true }), { status: 200 }],
            )

            const component = await render(
                <TrackerDataFetcher pollFrequency={TEST_POLL_FREQUENCY}>
                    {(trackerData) => (
                        <div>{trackerData.wins}-{trackerData.losses}</div>
                    )}
                </TrackerDataFetcher>
            )
    
            await waitFor(() => expect(fetch.mock.calls.length).toEqual(4), { timeout: TEST_POLL_FREQUENCY * expectedPollingCount + 500 })

            expect(fetch.mock.calls[0][0]).toEqual(mockPositionalUrl);
            expect(fetch.mock.calls[1][0]).toEqual(mockDeckListUrl);
            expect(fetch.mock.calls[2][0]).toEqual(mockPositionalUrl);
            expect(fetch.mock.calls[3][0]).toEqual(mockGameResultUrl);

            expect(TrackerData.history.length).toEqual(1);

            component.getByText('1-0');
        })
    })
})