/**
* Admin page
*/

var TeamManager = React.createClass({
  apiRequest: function (url, type, callback, data) {
    $.ajax({
      url: url,
      dataType: 'json',
      type: type,
      cache: false,
      data: data,
      success: callback.bind(this),
      error: function (xhr, status, err) {
        // TODO: better error handling
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleDelete: function (id, index) {
    var team = this.state.team;
    team.splice(index, 1);
    this.setState({team: team});
    this.apiRequest(this.props.url + '/' + id, 'DELETE', function () {});
  },
  handleEdit: function (index) {
    var member = this.state.team[index];
    this.setState({member: member});
  },
  // Handles both creating and updating a team member.
  handleSubmit: function () {
    var isNew = !this.state.member.id;
    var url =  this.props.url + (isNew ? '' : '/' + this.state.member.id);
    var type = isNew ? 'POST' : 'PUT';

    function callback (member) {
      if (isNew) {
        var team = this.state.team;
        var newTeam = [member].concat(team);
        this.setState({team: newTeam});
      }
      this.setState({member: {}});
    }
    this.apiRequest(url, type, callback, this.state.member);
  },
  handleFieldChange: function (member) {
    this.setState({member: member});
  },
  getInitialState: function () {
    return {team: [], member: {}};
  },
  componentDidMount: function () {
    this.apiRequest(this.props.url, 'GET', function (data) {
      this.setState({team: data});
    });
  },
  render: function () {
    return (
      <div className="teamManager">
        <h1>Manage the Tictail team</h1>
        <button className="add">Add new member</button>
        <TeamMemberForm onFieldChange={this.handleFieldChange}
                        onMemberSubmit={this.handleSubmit}
                        member={this.state.member} />
        <TeamMemberList onEditMember={this.handleEdit}
                        onDeleteMember={this.handleDelete}
                        team={this.state.team} />
      </div>
    );
  }
});

var TeamMemberList = React.createClass({
  handleDelete: function (id, index) {
    this.props.onDeleteMember(id, index);
    return;
  },
  handleEdit: function (index) {
    this.props.onEditMember(index);
    return;
  },
  render: function () {
    var teamMemberNodes = this.props.team.map(function (teamMember, index) {
      return (
        <TeamMember onEditMember={this.handleEdit}
                    onDeleteMember={this.handleDelete}
                    index={index}
                    firstName={teamMember.first_name}
                    lastName={teamMember.last_name}
                    teamName={teamMember.team}
                    location={teamMember.location}
                    id={teamMember.id} />
      );
    }, this);
    return (
      <table className="teamMemberList">
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Team</th>
          <th>Location</th>
          <th>Edit</th>
        </tr>
        {teamMemberNodes}
      </table>
    );
  }
});

var TeamMember = React.createClass({
  handleDelete: function () {
    if (confirm('Are you sure you want to delete this member?')) {
      this.props.onDeleteMember(this.props.id, this.props.index);
    }
    return;
  },
  handleEdit: function () {
    this.props.onEditMember(this.props.index);
    return;
  },
  render: function () {
    return (
      <tr className="teamMember" id={this.props.id} ref="teamMember">
        <td>{this.props.firstName}</td>
        <td>{this.props.lastName}</td>
        <td>{this.props.teamName}</td>
        <td>{this.props.location}</td>
        <td>
          <button className="edit" onClick={this.handleEdit}>Edit</button>
          <button className="delete" onClick={this.handleDelete}>Delete</button>
        </td>
      </tr>
    );
  }
});

var TeamMemberForm = React.createClass({
  handleSubmit: function (event) {
    event.preventDefault();
    if (!this.props.member.first_name ||
        !this.props.member.last_name ||
        !this.props.member.team ||
        !this.props.member.color ||
        !this.props.member.image ||
        !this.props.member.location) {
      // TODO: better error handling
      alert('Invalid Entry.');
      return;
    }
    this.props.onMemberSubmit();
  },
  handleChange: function (event) {
    var editedMember = this.props.member;
    editedMember[event.target.id] = event.target.value.trim();
    this.props.onFieldChange(editedMember);
    return;
  },
  render: function () {
    return (
      <form className="teamMemberForm" onSubmit={this.handleSubmit}>
        <input id="first_name" type="text" placeholder="First Name" value={this.props.member.first_name} onChange={this.handleChange}/>
        <input id="last_name" type="text" placeholder="Last Name" value={this.props.member.last_name} onChange={this.handleChange}/>
        <input id="title" type="text" placeholder="Title" value={this.props.member.title} onChange={this.handleChange}/>
        <input id="team" type="text" placeholder="Team" value={this.props.member.team} onChange={this.handleChange}/>
        <input id="color" type="text" placeholder="Color (hex code)" value={this.props.member.color} onChange={this.handleChange}/>
        <input id="image" type="text" placeholder="Avatar URL" value={this.props.member.image} onChange={this.handleChange}/>
        <input id="location" type="text" placeholder="Location" value={this.props.member.location} onChange={this.handleChange}/>
        <input type="text" ref="id" hidden value={this.props.member.id} onChange={this.handleChange}/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

React.render(
  <TeamManager url="contacts" />,
  document.getElementById('content')
);
