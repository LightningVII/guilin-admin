// eslint-disable-next-line import/no-extraneous-dependencies
import { Random } from 'mockjs';
import React from 'react';
import { Carousel, Modal, Button } from 'antd';
import styles from './styles.less';

const PrevArrow = ({ currentSlide, slideCount, ...arrowProps }) => (
  <Button {...arrowProps} ghost type="primary" shape="circle" icon="left" />
);

const NextArrow = ({ currentSlide, slideCount, ...arrowProps }) => (
  <Button {...arrowProps} ghost type="primary" shape="circle" icon="right" />
);

export default () => (
  <Modal
    footer={null}
    closeIcon={<Button ghost shape="circle" icon="close" />}
    centered
    bodyStyle={{ padding: 0 }}
    visible
    className={styles.modalCarousel}
  >
    <Carousel arrows prevArrow={<PrevArrow />} nextArrow={<NextArrow />} effect="fade">
      {[...Random.string(4, 4)].map((i, index) => (
        <div key={index.toString()}>
          <div
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundImage: `url(${Random.image()})`,
            }}
          ></div>
        </div>
      ))}
    </Carousel>
  </Modal>
);

// https://pic4.zhimg.com/50/v2-a77513f67280b7362a83beea53426f18_hd.jpg
