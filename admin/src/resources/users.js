// in src/Users.js
import React from 'react';
import {
  List,
  Edit,
  Create,
  Datagrid,
  TextField,
  EditButton,
  SimpleForm,
  TextInput,
  BooleanInput,
  Filter,
  Responsive,
  SimpleList,
} from 'admin-on-rest';


const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="email" source="email" alwaysOn />
  </Filter>
);

export const UserList = (props) => (
  <List
    {...props}
    filters={<UserFilter />}
    perPage={10}
  >
    <Responsive
      small={
        <SimpleList
          primaryText={record => record.email }
          secondaryText={record => record.first_name }
        />
      }
      medium={
        <Datagrid>
          <TextField source="email" />
          <TextField source="first_name" />
          <TextField source="last_name" />
          <EditButton />
        </Datagrid>
      }
    >
    </Responsive>
  </List>
);

const UserTitle = ({ record }) => {
  return <span>User {record ? `"${record.email}"` : ''}</span>;
};

export const UserEdit = (props) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <TextField source="email" />
      <TextInput source="first_name" />
      <TextInput source="last_name" />
      <BooleanInput source="is_email_verified" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" />
      <TextInput source="first_name" />
      <TextInput source="last_name" />
      <BooleanInput source="is_email_verified" />
    </SimpleForm>
  </Create>
);

