import React, { Suspense } from 'react';
import { ToolOutlined, InfoCircleOutlined, UserOutlined, SnippetsOutlined, UploadOutlined } from '@ant-design/icons';
import { Row, Col, Affix, Menu, Button, Dropdown, Card, message } from 'antd';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
import BaseMap from '../components/BaseMap';

import SearchGIS from '../components/SearchGIS';
import Compass from '../components/Compass';
import MapMeasure from '../components/MapMeasure';
import ModalSwipeTree from '../components/ModalSwipeTree';
import MapSwipe from '../components/MapSwipe';
import ModalCompareTree from '../components/ModalCompareTree';
import MapCompare from '../components/MapCompare';
import MapBottom from '../components/MapBottom';
import Print from '../components/PrintWidget';
import BookMark from '../components/BookMark';
import ImportGeo from '../components/ImportGeo';
import GISStastic from '../components/GISStastic'
import CircleSelect from '../components/CircleSelect'


import style from './style.css';

// const MyBasemap = React.lazy(() => import('../components/MyBasemap'));

export default class GlobeMapShow extends React.Component {
  constructor() {
    super();
    this.state = {
      mapView: null,
      renderMeasure: false,
      renderPrint: false,// Print对话框
      renderSwipe: false, // Swipe内容框
      swipeLayersArray: [], // Swipe选择的图层列表
      showSwipeModal: false, // Swipe Model选择框
      showBookMark: false, // 显示书签
      showImportGeo: false, // 显示导入
      showTJCard: false,// 显示右侧统计任务面板
      showCircleSelect: false,// 显示框选查询
      renderCompare: false, // Compare 内容框
      compareLayersArray: [], // Compare选择的图层列表
      showCompareModal: false, // Compare Model选择框
      featrueGraphic: null, // 传入Featrue的图斑编码
    };

  }

  addFeature2Cmp = graphic => {
    this.setState({
      renderCompare: true,
      featrueGraphic: graphic,
    });
  };

  handleMenuClick = ({ key }) => {
    switch (key) {
      case 'cl':
        this.setState(prevState => ({
          renderMeasure: !prevState.renderMeasure,
        }));
        break;
      case 'jl':
        this.setState(prevState => ({
          showSwipeModal: !prevState.showSwipeModal,
        }));
        break;
      case 'dp':
        this.setState(prevState => ({
          showCompareModal: !prevState.showCompareModal,
        }));
        break;
      case 'dy':
        this.setState(prevState => ({
          renderPrint: !prevState.renderPrint
        }));
        break;
      case 'sq':
        this.setState(prevState => ({
          showBookMark: !prevState.showBookMark
        }));
        break;
      case 'dr':
        this.setState(prevState => ({
          showImportGeo: !prevState.showImportGeo
        }));
        break;
      case 'tj':
        this.setState(prevState => ({
          showTJCard: !prevState.showTJCard
        }));
        break;
      case 'kx':
        this.setState(prevState => ({
          showCircleSelect: !prevState.showCircleSelect
        }));
        this.state.mapView.graphics.removeAll();
        break;
      default:
        break;
    }
  };

  handleMenuClose = () => {
    this.setState(prevState => ({
      showMeasure: !prevState.showMeasure,
    }));
  };

  onSetCompare = layersArray => {
    if (layersArray.length > 0)
      this.setState({
        showCompareModal: false,
        renderCompare: true,
        compareLayersArray: layersArray,
      });
    else
      this.setState({
        showCompareModal: false,
        renderCompare: false,
      });
  };

  onSetSwipe = (layersArray, rCount) => {
    if (rCount === 2)
      this.setState({
        showSwipeModal: false,
        renderSwipe: true,
        swipeLayersArray: layersArray,
      });
    else if (rCount === -1)
      this.setState({
        showSwipeModal: false,
        renderSwipe: false,
      });
    else message.info('请选择两幅栅格影像');
  };

  render() {

    return (
      <>
        <Affix className={style.menu} offsetTop={80}>
          <Button.Group className={style.menuGroup}>
            <Dropdown overlay={
              <Menu style={{ fontSize: 16 }} onClick={this.handleMenuClick}>
                <Menu.Item key="cl" >
                  <UserOutlined />
                  测量
               </Menu.Item>
                <Menu.Item key="sq" >
                  <UserOutlined />
                  书签
               </Menu.Item>
                <Menu.Item key="3">
                  <UserOutlined />
                  截图
               </Menu.Item>
                <Menu.Item key="dr">
                  <UploadOutlined />
                  导入
               </Menu.Item>
                <Menu.Item key="dy">
                  <UserOutlined />
                  打印
               </Menu.Item>
              </Menu>
            } >
              <Button style={{ fontSize: 16 }}><ToolOutlined />常用</Button>
            </Dropdown>
            <Dropdown
              overlay={
                <Menu onClick={this.handleMenuClick}>
                  <Menu.Item key="dx">
                    <UserOutlined />
                    点选
                  </Menu.Item>
                  <Menu.Item key="kx">
                    <UserOutlined />
                    框选
                  </Menu.Item>
                </Menu>
              }
            >
              <Button style={{ fontSize: 16 }}><InfoCircleOutlined />查询</Button>
            </Dropdown>
            <Dropdown
              overlay={
                <Menu onClick={this.handleMenuClick}>
                  <Menu.Item key="jl">
                    <UserOutlined />
                    卷帘
                  </Menu.Item>
                  <Menu.Item key="dp">
                    <UserOutlined />
                    多屏
                  </Menu.Item>
                  <Menu.Item key="tj">
                    <UserOutlined />
                    统计
                  </Menu.Item>
                </Menu>
              }
            >
              <Button style={{ fontSize: 16 }}><SnippetsOutlined />分析</Button>
            </Dropdown>
          </Button.Group>
        </Affix>

        <Affix className={style.measureCard} style={{ visibility: this.state.renderMeasure ? 'visible' : 'hidden' }} offsetTop={150}>
          <Card size="small" title="选择测量工具" extra={<a onClick={
            () => this.setState({
              renderMeasure: false
            })
          }>X</a>} style={{ width: 300 }}>
            <MapMeasure view={this.state.mapView} showMeasure={this.state.renderMeasure} />
          </Card>
        </Affix>

        {
          this.state.renderPrint ?
            <Affix className={style.print} offsetTop={80}>
              <Print view={this.state.mapView} />
            </Affix> : null
        }

        {this.state.showBookMark ? (
          <Affix offsetTop={80}>
            <BookMark view={this.state.mapView} />
          </Affix>
        ) : null}

        {
          this.state.showImportGeo ? (
            <ImportGeo visible={this.state.showImportGeo}
              onCloseModal={() => {
                this.setState({
                  showImportGeo: false
                })
              }}
            />
          ) : null
        }

        {
          this.state.showSwipeModal ? (
            <ModalSwipeTree onSetSwipe={this.onSetSwipe} />
          ) : null
        }

        {
          this.state.renderSwipe ? (
            <Affix className={style.mapSwipe} offsetTop={80}>
              <Card size="small" title="卷帘工具" extra={<a onClick={
                () => this.setState({
                  renderSwipe: false
                })
              }>X</a>}>
                <MapSwipe layersArray={this.state.swipeLayersArray} />
              </Card>
            </Affix>
          ) : null
        }

        {
          this.state.renderCompare ? (
            <Affix className={style.mapCompare} offsetTop={80}>
              <Card size="small" title="多屏工具" extra={<a onClick={
                () => this.setState({
                  renderCompare: false,
                  featrueGraphic: null
                })
              }>X</a>}>
                <MapCompare
                  featrueGraphic={this.state.featrueGraphic}
                  layersArray={this.state.compareLayersArray}
                />
              </Card>
            </Affix>
          ) : null
        }


        {
          this.state.mapView ?
            (<div className={style.mapBottom}>
              <MapBottom mapView={this.state.mapView} />
            </div>) : null
        }

        {
          this.state.mapView ?
            (<div className={style.compass} >
              <Compass view={this.state.mapView} />
            </div>
            ) : null
        }


        {
          this.state.mapView ? (
            <div className={style.search}>
              <SearchGIS addFeature={this.addFeature2Cmp} view={this.state.mapView} />
            </div>
          ) : null
        }


        {
          this.state.showCompareModal ?
            <ModalCompareTree onSetCompare={this.onSetCompare}
            /> : null
        }

        {
          this.state.showTJCard ? (
            <GISStastic
              visible={this.state.showTJCard}
              view={this.state.mapView}
              onClose={() => {
                this.setState({
                  showTJCard: false
                })
              }}
            />
          ) : null
        }


        {
          this.state.showCircleSelect ? (
            <CircleSelect
              visible={this.state.showCircleSelect}
              view={this.state.mapView}
              onClose={() => {
                this.setState({
                  showCircleSelect: false
                })
              }}
            />) : null
        }

        <Row style={{ margin: '-24px' }}  >
          <Col span={24}>
            <Suspense fallback="...loading">
              <BaseMap
                height="calc(100vh - 64px)"
                style={{ overflow: 'hidden' }}
                handleLoad={(map, view) => {
                  this.setState({ mapView: view });
                  view.ui.remove(['zoom', 'attribution']);
                }}
                child={
                  <div id='container' />
                }
              />
            </Suspense>
          </Col>
        </Row>
      </>
    );
  }
}
