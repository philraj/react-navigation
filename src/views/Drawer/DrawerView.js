/* @flow */

import React, { PureComponent } from 'react';
import DrawerLayout from 'react-native-drawer-layout';

import addNavigationHelpers from '../../addNavigationHelpers';
import DrawerNavigatorItems from './DrawerNavigatorItems';
import DrawerSidebar from './DrawerSidebar';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationRouter,
  NavigationState,
  NavigationAction,
} from '../../TypeDefinition';

export type DrawerScene = {
  route: NavigationRoute;
  focused: boolean;
  index: number;
  tintColor?: string;
};

export type DrawerViewConfig = {
  drawerWidth: number,
  contentComponent: ReactClass<*>,
  contentOptions?: {},
  style?: any;
};

type Navigation = NavigationScreenProp<NavigationState, NavigationAction>;

type Props = DrawerViewConfig & {
  screenProps?: {};
  router: NavigationRouter,
  navigation: Navigation,
};

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends PureComponent<void, Props, void> {

  static Items = DrawerNavigatorItems;

  props: Props;

  componentWillMount() {
    this._updateScreenNavigation(this.props.navigation);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.navigation.state.index !== nextProps.navigation.state.index) {
      const { routes, index } = nextProps.navigation.state;
      if (routes[index].routeName === 'DrawerOpen') {
        this._drawer.openDrawer();
      } else {
        this._drawer.closeDrawer();
      }
    }
    this._updateScreenNavigation(nextProps.navigation);
  }

  _screenNavigationProp: Navigation;

  _handleDrawerOpen = () => {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== 'DrawerOpen') {
      this.props.navigation.navigate('DrawerOpen');
    }
  };

  _handleDrawerClose = () => {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== 'DrawerClose') {
      this.props.navigation.navigate('DrawerClose');
    }
  };

  _updateScreenNavigation = (
    navigation: Navigation
  ) => {
    const navigationState: any = navigation.state.routes.find((route: *) => route.routeName === 'DrawerClose');
    if (this._screenNavigationProp && this._screenNavigationProp.state === navigationState) {
      return;
    }
    this._screenNavigationProp = addNavigationHelpers({
      ...navigation,
      state: navigationState,
    });
  }

  _getNavigationState = (navigation: Navigation) => {
    const navigationState: any = navigation.state.routes.find((route: *) => route.routeName === 'DrawerClose');
    return navigationState;
  };

  _renderNavigationView = () => (
    <DrawerSidebar
      navigation={this._screenNavigationProp}
      router={this.props.router}
      contentComponent={this.props.contentComponent}
      contentOptions={this.props.contentOptions}
      style={this.props.style}
    />
  );

  _drawer: any;

  render() {
    const DrawerScreen = this.props.router.getComponentForRouteName('DrawerClose');
    return (
      <DrawerLayout
        ref={(c: *) => (this._drawer = c)}
        drawerWidth={this.props.drawerWidth}
        onDrawerOpen={this._handleDrawerOpen}
        onDrawerClose={this._handleDrawerClose}
        renderNavigationView={this._renderNavigationView}
        drawerPosition={DrawerLayout.positions.Left}
      >
        <DrawerScreen
          screenProps={this.props.screenProps}
          navigation={this._screenNavigationProp}
        />
      </DrawerLayout>
    );
  }
}
