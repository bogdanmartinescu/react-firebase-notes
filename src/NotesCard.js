import React from 'react';

export default class NotesCard extends React.Component {
  constructor() {
    super();
    this.state = {
      editing: false,
      note: {}
    };
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    this.setState({
      note: this.props.note
    });
  }

  save(e) {
    e.preventDefault();
    let db = firebase.database().ref(`users/${userId}/notes/${this.state.note.key}`);
    let title = this.noteTitle.value;
    let text = this.noteText.value;

    db.update({
      title,
      text
    });

    this.setState({
      editing: false,
      note: {
        title,
        text
      }
    });
  }

  render() {
    let editingTemp = (
      <div>
        <h4>{this.state.note.title}</h4>
        <p>{this.state.note.text}</p>
      </div>
    )

    if(this.state.editing) {
      editingTemp = (
        <div>
          <form onSubmit={this.save}>
            <input type="text" defaultValue={this.state.note.title} name="title" ref={ref => this.noteTitle = ref} />
            <input type="text" defaultValue={this.state.note.text} name="text" ref={ref => this.noteText = ref} />
            <input type="submit" value="Submit" />
          </form>
        </div>
      )
    }
    return (
      <div className="noteCard">
      <i className="fa fa-edit" onClick={() => this.setState({editing: true})}></i>
      <i className="fa fa-times" onClick={() => this.props.removeNote(this.state.note.key)}></i>
      {editingTemp}
      </div>
    )
  }
}
