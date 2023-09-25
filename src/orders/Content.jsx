import React from 'react';
import {
  Grid, Paper, Button, Divider, Typography,
} from '@mui/material';

const user = {
  name: 'Thomas Test the 4th Lord of Testoopia',
  gender: 'cheesecake',
  age: 125,
  mood: 'grumpy',
  isAdmin: true,
};

const buttons = [
  {
    title: 'Сохранить',
    action: () => { alert('Button1'); },
  },
  {
    title: 'Закрыть',
    action: () => { alert('Button2'); },
  },
];

function Column(props) {
  return (
    <Paper className="column">
      <h2>{props.title}</h2>
      <p>{props.children}</p>
    </Paper>
  );
}
const ButtonRow = () => {
  const buttonRow = buttons.map(
    (button) => (<Button className="button" onClick={button.action}>{button.title}</Button>),
  );
  return buttonRow;
};

function Content({ history, match }) {
  const { id } = match.params;
  console.log('Content -> id: ', id);
  return (
    <Grid container className="content" spacing={1} justify="center">
      <Grid item md={10} xs={12}>
        <Paper className="header">
          <h1>Редактирование заказа: </h1>
          <Divider />
          <ButtonRow />
        </Paper>
      </Grid>
      <Grid item md={3} xs={12}>
        <Column title="Заголовок заказа: "><OrderContent order={user} /></Column>
      </Grid>
      <Grid item md={7} xs={12}>
        <Column title="Строки заказа: ">
          {user.name}
          {user.gender}
        </Column>
      </Grid>

    </Grid>
  );
}

function OrderContent(props) {
  const { order } = props;
  const entries = [];
  for (const [key, value] of Object.entries(order)) {
    entries.push(
      <>
        <Grid item xs={3}>
          <Typography variant="body1" gutterBottom>
            {key}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Divider orientation="vertical" />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body2" gutterBottom>
            {value.toString()}
          </Typography>
        </Grid>
      </>,
    );
  }
  return (
    <Grid container className="content" spacing={1} justify="center">
      {entries}
    </Grid>
  );
}

export { Content, OrderContent };
