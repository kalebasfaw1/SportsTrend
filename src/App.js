import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, User, Home, Calendar, DollarSign, AlertCircle, ChevronRight, Search, Bell } from 'lucide-react';

const SportsGamblingApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedGame, setSelectedGame] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);

  // Mock data
  const upcomingGames = [
    {
      id: 1,
      sport: 'NBA',
      homeTeam: 'Lakers',
      awayTeam: 'Celtics',
      homeOdds: -145,
      awayOdds: +125,
      spread: -3.5,
      total: 218.5,
      startTime: '7:30 PM ET',
      trend: 'hot',
      injuries: 1,
      value: true
    },
    {
      id: 2,
      sport: 'NFL',
      homeTeam: '49ers',
      awayTeam: 'Cowboys',
      homeOdds: -110,
      awayOdds: -110,
      spread: -2.5,
      total: 47.5,
      startTime: '8:15 PM ET',
      trend: 'neutral',
      injuries: 0,
      value: false
    },
    {
      id: 3,
      sport: 'NHL',
      homeTeam: 'Rangers',
      awayTeam: 'Bruins',
      homeOdds: +135,
      awayOdds: -155,
      spread: 1.5,
      total: 6.5,
      startTime: '7:00 PM ET',
      trend: 'cold',
      injuries: 2,
      value: true
    }
  ];

  const activeBets = [
    { id: 1, game: 'Warriors vs Nets', bet: 'Warriors -4.5', stake: 100, toWin: 91, status: 'live' },
    { id: 2, game: 'Chiefs vs Bills', bet: 'Over 52.5', stake: 50, toWin: 45, status: 'pending' }
  ];

  const userStats = {
    roi: '+12.4%',
    winRate: '54%',
    unitsWon: '+23.5',
    activeBets: 2
  };

  // Fetch real schedule data
  const fetchSchedule = async () => {
    setScheduleLoading(true);
    setScheduleError(null);
    
    try {
      // Using The Odds API for real sports data
      // You'll need to get a free API key from https://the-odds-api.com/
      const sports = ['basketball_nba', 'americanfootball_nfl', 'icehockey_nhl', 'soccer_epl'];
      const apiKey = 'YOUR_API_KEY'; // Replace with actual API key
      
      // For demo purposes, we'll create realistic mock data
      // In production, you'd fetch from the API like this:
      // const response = await fetch(`https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals`);
      
      const mockScheduleData = generateMockSchedule();
      setScheduleData(mockScheduleData);
      
    } catch (error) {
      setScheduleError('Failed to load schedule');
      console.error('Error fetching schedule:', error);
    } finally {
      setScheduleLoading(false);
    }
  };

  // Generate realistic mock schedule data
  const generateMockSchedule = () => {
    const today = new Date();
    const scheduleByDate = {};
    
    // Generate games for next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      scheduleByDate[dateKey] = {
        date: date,
        games: []
      };
      
      // NBA games
      if (i < 5) {
        const nbaGames = [
          { sport: 'NBA', home: 'Lakers', away: 'Celtics', time: '19:30' },
          { sport: 'NBA', home: 'Warriors', away: 'Nets', time: '22:00' },
          { sport: 'NBA', home: 'Heat', away: 'Bucks', time: '19:00' },
        ];
        scheduleByDate[dateKey].games.push(...nbaGames.slice(0, Math.floor(Math.random() * 3) + 1));
      }
      
      // NFL games (mostly weekends)
      if (date.getDay() === 0 || date.getDay() === 6) {
        const nflGames = [
          { sport: 'NFL', home: '49ers', away: 'Cowboys', time: '13:00' },
          { sport: 'NFL', home: 'Chiefs', away: 'Bills', time: '16:25' },
          { sport: 'NFL', home: 'Eagles', away: 'Packers', time: '20:20' },
        ];
        scheduleByDate[dateKey].games.push(...nflGames.slice(0, Math.floor(Math.random() * 3) + 1));
      }
      
      // NHL games
      if (i < 6) {
        const nhlGames = [
          { sport: 'NHL', home: 'Rangers', away: 'Bruins', time: '19:00' },
          { sport: 'NHL', home: 'Maple Leafs', away: 'Canadiens', time: '19:30' },
        ];
        scheduleByDate[dateKey].games.push(...nhlGames.slice(0, Math.floor(Math.random() * 2) + 1));
      }
      
      // Soccer games
      if (i % 2 === 0) {
        const soccerGames = [
          { sport: 'Soccer', home: 'Man City', away: 'Arsenal', time: '15:00' },
          { sport: 'Soccer', home: 'Liverpool', away: 'Chelsea', time: '17:30' },
        ];
        scheduleByDate[dateKey].games.push(...soccerGames.slice(0, 1));
      }
    }
    
    return scheduleByDate;
  };

  // Load schedule when tab is activated
  React.useEffect(() => {
    if (activeTab === 'schedule' && !scheduleData) {
      fetchSchedule();
    }
  }, [activeTab]);

  const renderSchedule = () => {
    if (scheduleLoading) {
      return (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-pulse">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading schedule...</p>
          </div>
        </div>
      );
    }

    if (scheduleError) {
      return (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-gray-600 mb-4">{scheduleError}</p>
          <button 
            onClick={fetchSchedule}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!scheduleData) {
      return null;
    }

    // Group games by sport
    const groupedBySport = {};
    Object.values(scheduleData).forEach(day => {
      day.games.forEach(game => {
        if (!groupedBySport[game.sport]) {
          groupedBySport[game.sport] = {};
        }
        const dateKey = day.date.toISOString().split('T')[0];
        if (!groupedBySport[game.sport][dateKey]) {
          groupedBySport[game.sport][dateKey] = {
            date: day.date,
            games: []
          };
        }
        groupedBySport[game.sport][dateKey].games.push(game);
      });
    });

    const formatDate = (date) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      }
    };

    return (
      <div className="space-y-6">
        {/* Sport Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedSport === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              All Sports
            </button>
            {Object.keys(groupedBySport).sort().map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedSport === sport ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule by Sport */}
        {(selectedSport === 'all' ? Object.keys(groupedBySport).sort() : [selectedSport])
          .filter(sport => groupedBySport[sport])
          .map(sport => (
            <div key={sport} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <h2 className="text-xl font-bold">{sport}</h2>
              </div>
              
              {Object.entries(groupedBySport[sport])
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([dateKey, dayData]) => (
                  <div key={dateKey} className="border-b last:border-b-0">
                    <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-700 flex items-center justify-between">
                      <span>{formatDate(dayData.date)}</span>
                      <span className="text-sm text-gray-500">
                        {dayData.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="divide-y">
                      {dayData.games.map((game, idx) => (
                        <div 
                          key={idx} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedGame({
                            id: `${dateKey}-${sport}-${idx}`,
                            sport: game.sport,
                            homeTeam: game.home,
                            awayTeam: game.away,
                            startTime: game.time,
                            homeOdds: Math.floor(Math.random() * 200) - 150,
                            awayOdds: Math.floor(Math.random() * 200) - 150,
                            spread: (Math.random() * 10 - 5).toFixed(1),
                            total: (Math.random() * 20 + 200).toFixed(1),
                            trend: ['hot', 'cold', 'neutral'][Math.floor(Math.random() * 3)],
                            injuries: Math.floor(Math.random() * 3),
                            value: Math.random() > 0.7
                          })}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="text-right w-32">
                                  <div className="font-semibold">{game.away}</div>
                                </div>
                                <div className="text-gray-400">@</div>
                                <div className="text-left w-32">
                                  <div className="font-semibold">{game.home}</div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{game.time}</div>
                              <ChevronRight size={20} className="text-gray-400 ml-auto" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Your Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.roi}</div>
            <div className="text-sm text-gray-600">ROI</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.winRate}</div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.unitsWon}</div>
            <div className="text-sm text-gray-600">Units Won</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{userStats.activeBets}</div>
            <div className="text-sm text-gray-600">Active Bets</div>
          </div>
        </div>
      </div>

      {/* Active Bets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Active Bets</h2>
        {activeBets.map(bet => (
          <div key={bet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
            <div className="flex-1">
              <div className="font-semibold">{bet.game}</div>
              <div className="text-sm text-gray-600">{bet.bet}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">${bet.stake}</div>
              <div className="text-sm text-green-600">To win: ${bet.toWin}</div>
            </div>
            <div className={`ml-4 px-3 py-1 rounded-full text-xs ${
              bet.status === 'live' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {bet.status}
            </div>
          </div>
        ))}
      </div>

      {/* Value Alerts */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center mb-3">
          <Target className="mr-2" size={24} />
          <h2 className="text-lg font-bold">Value Alerts</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Lakers -3.5 vs Celtics</span>
            <ChevronRight size={20} />
          </div>
          <div className="flex items-center justify-between">
            <span>Rangers ML vs Bruins</span>
            <ChevronRight size={20} />
          </div>
        </div>
      </div>

      {/* Today's Games */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Today's Games</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-3 py-1 rounded text-sm ${selectedSport === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedSport('NBA')}
              className={`px-3 py-1 rounded text-sm ${selectedSport === 'NBA' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              NBA
            </button>
            <button
              onClick={() => setSelectedSport('NFL')}
              className={`px-3 py-1 rounded text-sm ${selectedSport === 'NFL' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              NFL
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {upcomingGames
            .filter(game => selectedSport === 'all' || game.sport === selectedSport)
            .map(game => (
              <div 
                key={game.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600">{game.sport}</span>
                  <div className="flex items-center gap-2">
                    {game.value && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">VALUE</span>
                    )}
                    {game.injuries > 0 && (
                      <AlertCircle size={16} className="text-orange-500" />
                    )}
                    <span className="text-xs text-gray-600">{game.startTime}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-right">
                    <div className="font-bold">{game.awayTeam}</div>
                    <div className="text-sm text-gray-600">{game.awayOdds > 0 ? '+' : ''}{game.awayOdds}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">vs</div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{game.homeTeam}</div>
                    <div className="text-sm text-gray-600">{game.homeOdds > 0 ? '+' : ''}{game.homeOdds}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-around text-xs text-gray-600">
                  <span>Spread: {game.spread > 0 ? '+' : ''}{game.spread}</span>
                  <span>Total: {game.total}</span>
                  <span className={`font-semibold ${
                    game.trend === 'hot' ? 'text-red-600' : 
                    game.trend === 'cold' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {game.trend === 'hot' ? '🔥 Hot' : game.trend === 'cold' ? '❄️ Cold' : '➖ Neutral'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderGameAnalysis = () => {
    if (!selectedGame) {
      return (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Target size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Select a game to view detailed analysis</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedGame(null)}
          className="text-blue-600 hover:underline"
        >
          ← Back to games
        </button>

        {/* Game Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-xs font-semibold text-blue-600 mb-2">{selectedGame.sport}</div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold">{selectedGame.awayTeam}</div>
              <div className="text-xl text-gray-600 mt-1">{selectedGame.awayOdds > 0 ? '+' : ''}{selectedGame.awayOdds}</div>
            </div>
            <div className="text-gray-400 text-xl">@</div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold">{selectedGame.homeTeam}</div>
              <div className="text-xl text-gray-600 mt-1">{selectedGame.homeOdds > 0 ? '+' : ''}{selectedGame.homeOdds}</div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600">{selectedGame.startTime}</div>
        </div>

        {/* Key Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">Key Stats Comparison</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Recent Form (L5)</span>
              <div className="flex gap-4">
                <span className="font-semibold">4-1</span>
                <span className="text-gray-400">vs</span>
                <span className="font-semibold">3-2</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Points Per Game</span>
              <div className="flex gap-4">
                <span className="font-semibold">112.4</span>
                <span className="text-gray-400">vs</span>
                <span className="font-semibold">108.7</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">ATS Record</span>
              <div className="flex gap-4">
                <span className="font-semibold">8-3</span>
                <span className="text-gray-400">vs</span>
                <span className="font-semibold">5-6</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center mb-3">
            <TrendingUp className="mr-2" size={20} />
            <h3 className="font-bold">AI Insights</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>• {selectedGame.awayTeam} is 7-2 ATS in their last 9 road games</li>
            <li>• {selectedGame.homeTeam} averaging 5 more PPG at home this season</li>
            <li>• Historical head-to-head favors away team by 3.2 points</li>
            <li>• Line has moved 1.5 points toward {selectedGame.homeTeam} (sharp money indicator)</li>
          </ul>
        </div>

        {/* Line Movement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">Line Movement</h3>
          <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            [Line movement chart would appear here]
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Performance Analytics</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500 mb-4">
          [ROI Chart Over Time]
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-gray-600">Best Sport</div>
            <div className="text-xl font-bold">NBA (+18.2%)</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-gray-600">Best Bet Type</div>
            <div className="text-xl font-bold">Spreads (+15.1%)</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Betting Trends</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Home Favorites</span>
              <span className="font-semibold">62% Win Rate</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '62%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Road Underdogs</span>
              <span className="font-semibold">48% Win Rate</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{width: '48%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Totals (Over)</span>
              <span className="font-semibold">51% Win Rate</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '51%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBets = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Bet History</h2>
        <div className="space-y-3">
          {[...activeBets, 
            { id: 3, game: 'Heat vs Knicks', bet: 'Heat ML', stake: 75, toWin: 68, status: 'won', result: '+68' },
            { id: 4, game: 'Packers vs Vikings', bet: 'Under 45.5', stake: 100, toWin: 91, status: 'lost', result: '-100' }
          ].map(bet => (
            <div key={bet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-semibold">{bet.game}</div>
                <div className="text-sm text-gray-600">{bet.bet}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${bet.stake}</div>
                {bet.result && (
                  <div className={`text-sm font-semibold ${bet.status === 'won' ? 'text-green-600' : 'text-red-600'}`}>
                    {bet.result}
                  </div>
                )}
              </div>
              <div className={`ml-4 px-3 py-1 rounded-full text-xs ${
                bet.status === 'live' ? 'bg-red-100 text-red-700' : 
                bet.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                bet.status === 'won' ? 'bg-green-100 text-green-700' :
                'bg-gray-200 text-gray-700'
              }`}>
                {bet.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Bankroll Management</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Starting Bankroll</span>
            <span className="font-bold">$1,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Bankroll</span>
            <span className="font-bold text-green-600">$1,235</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Profit/Loss</span>
            <span className="font-bold text-green-600">+$235</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="mr-2" size={28} />
            <h1 className="text-xl font-bold">Sports Analytics Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <Search size={20} className="cursor-pointer" />
            <Bell size={20} className="cursor-pointer" />
            <User size={20} className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 pb-24">
        {selectedGame ? renderGameAnalysis() : (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'bets' && renderBets()}
            {activeTab === 'schedule' && renderSchedule()}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-around p-3">
          <button
            onClick={() => { setActiveTab('home'); setSelectedGame(null); }}
            className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => { setActiveTab('analytics'); setSelectedGame(null); }}
            className={`flex flex-col items-center ${activeTab === 'analytics' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <TrendingUp size={24} />
            <span className="text-xs mt-1">Analytics</span>
          </button>
          <button
            onClick={() => { setActiveTab('bets'); setSelectedGame(null); }}
            className={`flex flex-col items-center ${activeTab === 'bets' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <DollarSign size={24} />
            <span className="text-xs mt-1">My Bets</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-600"
            onClick={() => { setActiveTab('schedule'); setSelectedGame(null); }}
          >
            <Calendar size={24} />
            <span className="text-xs mt-1">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SportsGamblingApp;