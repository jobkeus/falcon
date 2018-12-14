import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import { Loader } from '@deity/falcon-ecommerce-uikit';
import { ThemeProvider } from '@deity/falcon-ui';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';
import isOnline from '@deity/falcon-client/src/components/isOnline';
import ScrollToTop from '@deity/falcon-client/src/components/ScrollToTop';
import {
  AppLayout,
  ProtectedRoute,
  OnlyUnauthenticatedRoute,
  Header,
  Footer,
  FooterQuery,
  HeaderQuery,
  LocaleProvider
} from '@deity/falcon-ecommerce-uikit';
import { ThemeEditor, ThemeEditorState } from '@deity/falcon-theme-editor';
import loadable from 'src/components/loadable';
import { ErrorBoundary } from 'src/components/ErrorBoundary';
import Home from 'src/pages/Home';
import logo from 'src/assets/logo.png';
import { Sidebar, SidebarContainer } from 'src/pages/shop/components/Sidebar';
import { deityGreenTheme, globalCss } from './theme';

const HeadMetaTags = () => (
  <Helmet defaultTitle="Deity Shop with Blog" titleTemplate="%s | Deity Shop with Blog">
    <meta name="description" content="This is example of Shop with Blog powered by Deity Falcon" />
    <meta name="keywords" content="pwa,reactjs,ecommerce,magento,shop,webshop,deity" />
    <meta name="theme-color" content="#fff" />
    <meta name="format-detection" content="telephone=yes" />
    <meta property="og:title" content="Deity Shop with Blog" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="This is example of Shop with Blog powered by Deity Falcon" />
    <meta property="og:url" content="/" />
    <meta property="og:image" content={logo} />
    <meta property="og:image:width" content="300" />
    <meta property="og:image:height" content="107" />
  </Helmet>
);

const Category = loadable(() => import(/* webpackChunkName: "shop/category" */ './pages/shop/Category'));
const Product = loadable(() => import(/* webpackChunkName: "shop/product" */ './pages/shop/Product'));
const SignIn = loadable(() => import(/* webpackChunkName: "account/sign-in" */ './pages/account/SignIn'));
const Dashboard = loadable(() => import(/* webpackChunkName: "account/dashboard" */ './pages/account/Dashboard'));
const ResetPassword = loadable(() => import(/* webpackChunkName: "shop/resetpassword" */ './pages/shop/ResetPassword'));
const Blog = loadable(() => import(/* webpackChunkName: "blog/blog" */ './pages/blog/Blog'));
const BlogPost = loadable(() => import(/* webpackChunkName: "blog/post" */ './pages/blog/Post'));
const Cart = loadable(() => import(/* webpackChunkName: "shop/cart" */ './pages/shop/Cart'));
const Checkout = loadable(() => import(/* webpackChunkName: "shop/checkout" */ './pages/shop/Checkout'));
const CheckoutConfirmation = loadable(() =>
  import(/* webpackChunkName: "shop/checkout" */ './pages/shop/CheckoutConfirmation')
);

const SidebarContents = loadable(() =>
  import(/* webpackPrefetch: true, webpackChunkName: "shop/SidebarContents" */ './pages/shop/components/Sidebar/SidebarContents')
);

let ThemeEditorComponent;
// ThemeEditor gets loaded only in dev mode
// condition below helps with tree shaking of unused exports
// so ThemeEditor gets dead code eliminated in production mode
if (process.env.NODE_ENV !== 'production') {
  ThemeEditorComponent = ThemeEditor;
}

const App = ({ online }) => (
  <LocaleProvider>
    <ScrollToTop />
    <ThemeEditorState initial={deityGreenTheme}>
      {props => (
        <React.Fragment>
          <ThemeProvider theme={props.theme} globalCss={globalCss}>
            <HeadMetaTags />
            <AppLayout>
              <HeaderQuery>{data => <Header {...data} />}</HeaderQuery>
              {!online && <p>you are offline.</p>}
              <ErrorBoundary>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/blog/:page?" component={Blog} />
                  <Route exact path="/cart" component={Cart} />
                  <Route exact path="/checkout" component={Checkout} />
                  <Route exact path="/checkout/confirmation" component={CheckoutConfirmation} />
                  <Route exact path="/reset-password" component={ResetPassword} />
                  <ProtectedRoute exact path="/account" component={Dashboard} />
                  <OnlyUnauthenticatedRoute exact path="/sign-in" component={SignIn} />
                  <OnlyUnauthenticatedRoute exact path="/reset-password" component={ResetPassword} />
                  <DynamicRoute
                    loaderComponent={Loader}
                    components={{
                      'blog-post': BlogPost,
                      'shop-category': Category,
                      'shop-product': Product
                    }}
                  />
                </Switch>
                <FooterQuery>{data => <Footer {...data} />}</FooterQuery>

                <SidebarContainer>
                  {sidebarProps => (
                    <Sidebar {...sidebarProps}>
                      {() => <SidebarContents contentType={sidebarProps.contentType} />}
                    </Sidebar>
                  )}
                </SidebarContainer>
              </ErrorBoundary>
            </AppLayout>
          </ThemeProvider>
          {ThemeEditorComponent && <ThemeEditorComponent {...props} side="left" />}
        </React.Fragment>
      )}
    </ThemeEditorState>
  </LocaleProvider>
);

App.propTypes = {
  online: PropTypes.bool
};

export default isOnline()(App);
