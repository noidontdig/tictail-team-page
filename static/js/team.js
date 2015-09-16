/**
* Team page
*/

var TeamDisplayer = React.createClass({
  getInitialState: function () {
    return {team: []};
  },
  componentDidMount: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({team: data});
      }.bind(this),
      error: function (xhr, status, err) {
        // TODO: better error handlind
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    var teamMemberNodes = this.state.team.map(function (teamMember) {
      return (
        <TeamMember firstName={teamMember.first_name}
                    lastName={teamMember.last_name}
                    teamName={teamMember.team}
                    location={teamMember.location}
                    color={teamMember.color}
                    image={teamMember.image}
                    title={teamMember.title} />
      );
    }, this);
    return (
      <div className="teamDisplayer">
        {teamMemberNodes}
      </div>
    );
  }
});

var TeamMember = React.createClass({
  render: function () {
    var divStyle = {
      backgroundColor: '#' + this.props.color
    };
    return (
      <div className="teamMember" style={divStyle}>
        <div>{this.props.firstName} {this.props.lastName}</div>
        <div>{this.props.title}</div>
        <div>{this.props.teamName}</div>
        <div>{this.props.location}</div>
        <img src={this.props.image} />
      </div>
    );
  }
});

React.render(
  <TeamDisplayer url="contacts" />,
  document.getElementById('content')
);