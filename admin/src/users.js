// in src/Users.js
import React from 'react';
import {
  List,
  Edit,
  Create,
  Datagrid,
  TextField,
  EditButton,
  DisabledInput,
  LongTextInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'admin-on-rest';

// const UserFilter = (props) => (
//   <Filter {...props}>
//     <TextInput label="Search" source="q" alwaysOn />
//     <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
//       <SelectInput optionText="name" />
//     </ReferenceInput>
//   </Filter>
// );

// first_name
// last_name
// email
// password_hash
// reset_password_token
// is_email_verified ... TODO

export const UserList = (props) => (
  <List {...props} >
    <Datagrid>
      <TextField source="email" />
      <TextField source="first_name" />
      <TextField source="last_name" />
      <EditButton />
    </Datagrid>
  </List>
);

const UserTitle = ({ record }) => {
  return <span>User {record ? `"${record.title}"` : ''}</span>;
};

export const UserEdit = (props) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <ReferenceInput label="User" source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <LongTextInput source="body" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <LongTextInput source="body" />
    </SimpleForm>
  </Create>
);

