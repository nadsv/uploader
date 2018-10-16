import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import Home from './components/Home/Home';
import Doc from './containers/Doc/Doc';
import NewsForm from './containers/NewsForm/NewsForm';
import GalleryForm from './containers/GalleryForm/GalleryForm';
import Searching from './components/Searching/Searching';

class App extends Component {
  render () {
    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/document" exact component={Doc} />
            <Route path="/news" exact component={NewsForm} />
            <Route path="/gallery" exact component={GalleryForm} />
            <Route path="/searching" exact component={Searching} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
