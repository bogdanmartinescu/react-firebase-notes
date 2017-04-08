import React from 'react';
import ReactDOM from 'react-dom';
import NotesCard from './NotesCard';

const config = {
  apiKey: "AIzaSyCEvNYx5urA6NJIFpnwBomvyU6zBX5rbLI",
  authDomain: "noted-d3344.firebaseapp.com",
  databaseURL: "https://noted-d3344.firebaseio.com",
  storageBucket: "noted-d3344.appspot.com",
  messagingSenderId: "38023973868"
};

firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        notes: [],
        loggedIn: false
    };

    this.showSidebar = this.showSidebar.bind(this);
    this.addNote = this.addNote.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.createUser = this.createUser.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.removeNote = this.removeNote.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        firebase.database().ref(`users/${user.uid}/notes`).on('value', (res) => {
          const data = res.val();
          const arr = [];
          for(let k in data) {
            data[k].key = k;
            arr.push(data[k])
          }

          this.setState({
            notes: arr,
            loggedIn: true
          });
        });
      } else {
        this.setState({
          notes: [],
          loggedIn: false
        });
      }
    })

  }

  showSidebar(e) {
    e.preventDefault();
    this.sidebar.classList.toggle('show');
  }

  renderCards() {
    if(this.state.loggedIn) {
      return this.state.notes.map((note, i) => {
        return <NotesCard note={note} key={i} removeNote={this.removeNote}/>
      }).reverse();
    } else {
      return <h2>Login to add notes</h2>
    }
  }

  addNote(e) {
    e.preventDefault();
    const note = {
      title: this.noteTitle.value,
      text: this.noteText.value
    };
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.database().ref(`users/${uid}/notes`);
    db.push(note)

    this.noteTitle.value = "";
    this.noteText.value = "";
    this.showSidebar(e);
  }

  removeNote(id) {
    console.log('remove ' + id);
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.database().ref(`users/${uid}/notes/${id}`);
    db.remove();
  }

  createAccount(e) {
    e.preventDefault();
    this.overlay.classList.toggle('show');
    this.createUserModal.classList.toggle('show');
  }

  showLogin(e) {
    e.preventDefault();
    this.overlay.classList.toggle('show');
    this.loginModal.classList.toggle('show');
  }

  logOut() {
    firebase.auth().signOut();
  }

  loginUser(e) {
    e.preventDefault();
    let email = this.userEmail.value;
    let password = this.userPassword.value;

    firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
              console.log(res);
              this.showLogin(e);
            })
            .catch(e => {
              console.log(e.message);
            })
  }

  createUser(e) {
    e.preventDefault();
    let email = this.createEmail.value;
    let password = this.createPassword.value;
    let confirm = this.confirmPassword.value;

    if(password === confirm) {
      firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // console.log(res);
        this.closeModal(e);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorMessage);
      });
    }
  }

  closeModal(e) {
    e.preventDefault();
    this.overlay.classList.toggle('show');
    this.createUserModal.classList.toggle('show');
  }

  render() {
    return (
      <div>
        <header className="mainHeader">
          <h1>Noted</h1>
          <nav>
            { (() => {
                if(this.state.loggedIn) {
                  return(
                    <div>
                      <a href="#" onClick={this.showSidebar}>Add new Note</a>
                      <a href="#" onClick={this.logOut}>Logout</a>
                    </div>
                  );
                } else {
                    return (
                      <div>
                        <a href="#" onClick={this.createAccount}>Create Account</a>
                        <a href="#" onClick={this.showLogin}>Login</a>
                      </div>
                    );
                }

              })()
            }
          </nav>
        </header>

        <div className="overlay" ref={ref => this.overlay = ref}></div>

        <section className="notes">
          {this.renderCards()}
        </section>

        <aside className="sidebar" ref={ref => this.sidebar = ref}>
          <form onSubmit={this.addNote}>
            <h3>Add new note</h3>
            <div className="close-btn">
              <i className="fa fa-times"></i>
            </div>
            <label htmlFor="note-title">Title:</label>
            <input type="text" name="note-title" ref={ref => this.noteTitle = ref}/>
            <label htmlFor="note-text">Text:</label>
            <textarea name="note-text" ref={ref => this.noteText = ref}></textarea>
            <input type="submit" value="Add new note" />
          </form>
        </aside>

        <div className="loginModal modal" ref={ref => this.loginModal = ref}>
          <div className="close" onClick={this.showLogin}>
            <i className="fa fa-times"></i>
          </div>

          <form onSubmit={this.loginUser}>
            <div>
              <label htmlFor="createEmail">Email:</label>
              <input type="text" name="createEmail" ref={ref => this.userEmail = ref} />
            </div>

            <div>
              <label htmlFor="createPassword">Password:</label>
              <input type="text" name="createPassword" ref={ref => this.userPassword = ref} />
            </div>

            <div>
              <input type="submit" value="Log the fuck in!" />
            </div>
          </form>
        </div>

        <div className="createUserModal modal" ref={ref => this.createUserModal = ref}>
          <div className="close" onClick={this.createAccount}>
            <i className="fa fa-times"></i>
          </div>

          <form onSubmit={this.createUser}>
            <div>
              <label htmlFor="createEmail">Email:</label>
              <input type="text" name="createEmail" ref={ref => this.createEmail = ref} />
            </div>

            <div>
              <label htmlFor="createPassword">Password:</label>
              <input type="text" name="createPassword" ref={ref => this.createPassword = ref} />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input type="text" name="confirmPassword" ref={ref => this.confirmPassword = ref} />
            </div>

            <div>
              <input type="submit" value="Create Account" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
