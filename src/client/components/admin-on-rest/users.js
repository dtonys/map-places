// in posts.js
import React from 'react';
import { List,
  Datagrid,
  Edit,
  Create,
  SimpleForm,
  DateField,
  TextField,
  EditButton,
  DisabledInput,
  TextInput,
  LongTextInput,
  DateInput,
  BooleanInput,
} from 'admin-on-rest';
export PostIcon from 'material-ui/svg-icons/action/book';

export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="email" />
      <DateField source="last_name" />
      <TextField source="first_name" />
      <TextField source="last_name" />
      <EditButton basePath="/users" />
    </Datagrid>
  </List>
);

const UserTitle = ({ record }) => {
  return <span>User {record ? `${record.email}` : ''}</span>;
};

export const UserEdit = (props) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <TextInput source="first_name" />
      <TextInput source="last_name" />
      <BooleanInput label="Email verified" source="is_email_verified" />
      {/*
        <TextInput source="title" />
        <TextInput source="teaser" options={{ multiLine: true }} />
        <LongTextInput source="body" />
        <DateInput label="Publication date" source="published_at" />
        <TextInput source="average_note" />
        <DisabledInput label="Nb views" source="views" />
      */}
    </SimpleForm>
  </Edit>
);

export const UserCreate = (props) => (
  <Create title="Create a User" {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="teaser" options={{ multiLine: true }} />
      <LongTextInput source="body" />
      <TextInput label="Publication date" source="published_at" />
      <TextInput source="average_note" />
    </SimpleForm>
  </Create>
);
