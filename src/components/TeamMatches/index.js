import {Component} from 'react'
import {Link, useParams} from 'react-router-dom'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'
import PieChart from '../PieChart'
import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {id} = this.props.params // Changed from match.params to props.params
    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: this.getFormattedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getFormattedData(eachMatch),
      ),
    }
    this.setState({teamMatchesData: formattedData, isLoading: false})
  }

  getNoOfMatches = value => {
    const {teamMatchesData} = this.state
    const {latestMatch, recentMatches} = teamMatchesData
    const currentMatch = value === latestMatch.matchStatus ? 1 : 0
    const result =
      recentMatches.filter(match => match.matchStatus === value).length +
      currentMatch
    return result
  }

  generatePieChartData = () => [
    {name: 'Won', value: this.getNoOfMatches('Won')},
    {name: 'Lost', value: this.getNoOfMatches('Lost')},
    {name: 'Drawn', value: this.getNoOfMatches('Drawn')},
  ]

  renderRecentMatchesList = () => {
    const {teamMatchesData} = this.state
    const {recentMatches} = teamMatchesData

    return (
      <ul className="recent-matches-list mb-0">
        {recentMatches.map(recentMatch => (
          <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
        ))}
      </ul>
    )
  }

  renderTeamMatches = () => {
    const {teamMatchesData} = this.state
    const {teamBannerURL, latestMatch} = teamMatchesData

    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatch} />
        <h1 className="latest-match-heading mt-3">Team Statistics</h1>
        <PieChart data={this.generatePieChartData()} />
        {this.renderRecentMatchesList()}
        <Link to="/" className="text-decoration-none">
          <button type="button" className="back-button">
            Back to Home
          </button>
        </Link>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <div>Loading...</div>
    </div>
  )

  getRouteClassName = () => {
    const {id} = this.props.params // Changed from match.params to props.params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

// Create a wrapper component to use hooks with class component
function TeamMatchesWrapper(props) {
  const params = useParams()
  return <TeamMatches {...props} params={params} />
}

export default TeamMatchesWrapper