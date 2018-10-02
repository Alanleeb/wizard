import React, { Fragment } from 'react';
import { Form, Grid, Image, Container, Divider, Header, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { updateUser } from '../reducers/user'

const defaultImage = 'https://d30y9cdsu7xlg0.cloudfront.net/png/15724-200.png'

class Profile extends React.Component {
  state = { editing: false, formValues: { name: '', email: '', file: '' } }

  // componentDidMount() {
  //   const { user: { name, email } } = this.props;
  //   this.setState({ formValues: { name, email } })
  // }

  static getDerivedStateFromProps(props, state) {
    const { user } = props 
    const { formValues, editing } = state 
    if (user.name !== formValues.name && !editing) {
      return { formValues: {name: user.name, email: user.email } }
    }
  }

  onDrop = (files) => {
    this.setState({ formValues: { ...this.state.formValues, file: files[0] } })
   }

  toggleEdit = () => {
    this.setState( state => {
      return { editing: !state.editing }
    })
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({ 
      formValues: {
        ...this.state.formValues,
        [name]: value
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { formValues: { name, email, file }} = this.state
    const { user, dispatch } = this.props;
    dispatch(updateUser(user.id, { name, email, file }))
    this.setState({ 
      editing: false,
      formValues: {
        ...this.state.formValues,
        file: ''
      }
     })
  }

  profileView = () => {
    const { user } = this.props;
    return (
      <Fragment>
        <Grid.Column width={4}>
          <Image src={user.image || defaultImage } alt="user avatar" />
        </Grid.Column>
        <Grid.Column width={8}>
          <Header as="h1">{user.name}</Header>
          <Header as="h1">{user.email}</Header>
        </Grid.Column>
      </Fragment>
    )
  }

  editView = () => {
    const { formValues: { name, email, file } } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Grid.Column width={4}>
        <Dropzone
          onDrop={this.onDrop}
          multiple={false}
        >
          { file && <Image src={file.preview} alt="upload preview"/> }
        </Dropzone>
        </Grid.Column>
        <Grid.Column width={8}>
          <Form.Input
            label="Name"
            name="name"
            value={name}
            required
            onChange={this.handleChange}
          />
          <Form.Input
            label="Email"
            name="email"
            value={email}
            required
            onChange={this.handleChange}
            type="email"
          />
          <Button>Update</Button>
        </Grid.Column>
      </Form>
    )
  }

  render() {
    const { editing } = this.state;
    return (
      <Container>
        <Divider hidden />
        <Grid>
          <Grid.Row>
            { editing ? this.editView() : this.profileView() }
            <Grid.Column>
              <Button onClick={this.toggleEdit}>{ editing ? 'Cancel' : 'Edit' }</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Profile)