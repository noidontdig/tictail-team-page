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
        this.setState({hasAPIError: true});
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
    this.showForm();
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
      this.hideForm();
    }
    this.apiRequest(url, type, callback, this.state.member);
  },

  handleFieldChange: function (member) {
    this.setState({member: member});
  },

  handleAdd: function () {
    this.setState({member: {}});
    this.showForm();
  },

  handleCancel: function () {
    this.hideForm();
  },

  showForm: function () {
    this.setState({showForm: true, hasFormError: false}, function () {
      document.getElementById('first_name').focus();
    });
  },

  hideForm: function () {
    this.setState({showForm: false, member: {}, hasFormError: false});
  },

  handleError: function () {
    this.setState({hasFormError: true});
  },

  getInitialState: function () {
    return {
      team: [],
      member: {},
      showForm: false,
      hasFormError: false,
      hasAPIError: false
    };
  },

  componentDidMount: function () {
    this.apiRequest(this.props.url, 'GET', function (data) {
      this.setState({team: data});
    });
  },

  render: function () {
    return (
      <div className="teamManager">
        {this.state.hasAPIError ? <p className="error api">Invalid request. Please reload the page.</p> : null}
        <h1>Manage the Tictail team</h1>
        <button className="add button primary" onClick={this.handleAdd}>+ Add new member</button>
        {this.state.showForm ? <TeamMemberForm onFormError={this.handleError}
                                               onFieldChange={this.handleFieldChange}
                                               onMemberSubmit={this.handleSubmit}
                                               onCancel={this.handleCancel}
                                               member={this.state.member}
                                               hasError={this.state.hasFormError} />
                              : null}

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
                    id={teamMember.id} />
      );
    }, this);
    return (
      <table className="teamMemberList">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th className="teamCell">Team</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {teamMemberNodes}
        </tbody>
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
        <td className="teamCell">{this.props.teamName}</td>
        <td>
          <button className="edit button" onClick={this.handleEdit}>Edit</button>
          <button className="delete button" onClick={this.handleDelete}>Delete</button>
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
      this.props.onFormError();
      return;
    }
    this.props.onMemberSubmit();
    return;
  },
  handleChange: function (event) {
    var editedMember = this.props.member;
    editedMember[event.target.id] = event.target.value.trim();
    this.props.onFieldChange(editedMember);
    return;
  },
  handleCancel: function (event) {
    event.preventDefault();
    this.props.onCancel();
    return;
  },
  render: function () {
    return (
      <form className="teamMemberForm" onSubmit={this.handleSubmit}>
        <label for="first_name">First Name</label>
        <input id="first_name" type="text" placeholder="First Name *" value={this.props.member.first_name} onChange={this.handleChange} autofocus/>

        <label for="last_name">Last Name</label>
        <input id="last_name" type="text" placeholder="Last Name *" value={this.props.member.last_name} onChange={this.handleChange}/>

        <label for="title">Title</label>
        <input id="title" type="text" placeholder="Title" value={this.props.member.title} onChange={this.handleChange}/>

        <label for="team">Team</label>
        <input id="team" type="text" placeholder="Team *" value={this.props.member.team} onChange={this.handleChange}/>

        <label for="color">Color</label>
        <input id="color" type="text" placeholder="Color (ex: '000000') *" value={this.props.member.color} onChange={this.handleChange}/>

        <label for="image">Image URL</label>
        <input id="image" type="text" placeholder="Image URL *" value={this.props.member.image} onChange={this.handleChange}/>

        <label for="Location">Location</label>
        <input id="location" type="text" placeholder="Location *" value={this.props.member.location} onChange={this.handleChange}/>

        <input type="text" ref="id" hidden value={this.props.member.id} onChange={this.handleChange}/>
        {this.props.hasError ? <p className="error">Invalid submission. Please fill in all mandatory fields (*).</p> : null}
        <div>
          <input className="submit primary button" type="submit" value="Submit" />
          <button className="cancel button" onClick={this.handleCancel}>Cancel</button>
        </div>
      </form>
    );
  }
});

React.render(
  <TeamManager url="contacts" />,
  document.getElementById('content')
);
