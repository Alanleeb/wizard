import React, { Fragment } from 'react';
import {
    Form, 
    Grid, 
    Image,
    Container,
    Divider,
    Header,
    Button,
    GridColumn
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { updateUser } from '../reducers/user';

const defaultImage = 'https://d30y9cdsu7xlg0.cloudfront.net/png/15724-200.png'

class Profile extends React.Component {
    state = { editing: false, formValues: {name: '', email: '', file: ''} }

    componentDidMount() {
        const {user: {name, email} } = this.props
        this.setState({ formValues: { name, email } })
    }

    onDrop = (files) => {
        this.setState({formValues: { ...this.state.formValues, file: files[0] } })
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

    profieView = () => {
        const { user } = this.props;
        return (
            <Fragment>
                <Grid.Column width={4}>
        <Image src={ user.image || defaultImage } />
                </Grid.Column>
                <GridColumn width={8}>
                    <Header as="h1">{user.name}</Header>
                    <Header as="h1">{user.email}</Header>
                </GridColumn>
            </Fragment>
        )
    }

    editView = () => {
        const { user } = this.props;
        const { formValues: {name, email, file} } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Grid.Column width={4}>
                <Dropzone
                    onDrop={this.onDrop}
                    multiple={true}
                    >
                        { file && <Image src={file.preview} /> }
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
                    />
                    <Button>Update</Button>
                </Grid.Column>
            </Form>
        ) 
    }

    render() {
        const { editing } = this.state;
        return(
            <Container>
                <Divider hidden />
                <Grid>
                    <Grid.Row>
                        { editing ? this.editView() : this.profieView() }
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
