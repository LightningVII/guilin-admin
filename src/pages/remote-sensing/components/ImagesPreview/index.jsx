// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import { Carousel, Empty, Modal, Icon, Button } from 'antd';
import styles from './styles.less';

const PrevArrow = ({ currentSlide, slideCount, ...arrowProps }) => (
  <Button {...arrowProps} ghost type="primary" icon="left-circle" />
);

const NextArrow = ({ currentSlide, slideCount, ...arrowProps }) => (
  <Button {...arrowProps} ghost type="primary" icon="right-circle" />
);

export default ({ visible, handleCloseClick, images }) => (
  <Modal
    footer={null}
    closeIcon={<Icon className={styles.icon} type="close" />}
    centered
    bodyStyle={{ padding: 0 }}
    visible={visible}
    className={styles.modalCarousel}
    onCancel={handleCloseClick}
  >
    <Carousel arrows prevArrow={<PrevArrow />} nextArrow={<NextArrow />} effect="fade">
      {images && images.length ? (
        images.map((i, index) => (
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
                backgroundImage: `url(${i})`,
              }}
            ></div>
          </div>
        ))
      ) : (
        <Empty />
      )}
    </Carousel>
  </Modal>
);

// https://pic4.zhimg.com/50/v2-a77513f67280b7362a83beea53426f18_hd.jpg
