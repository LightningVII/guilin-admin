import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
// import { template } from './featureTemplate.js';

const MyImageLayer = props => {
    const [imageLayer, setImageLayer] = useState(null);
 
    useEffect(() => {
        loadModules(['esri/core/urlUtils', 'esri/layers/WebTileLayer'])
            .then(([urlUtils, WebTileLayer]) => {
                urlUtils.addProxyRule({
                    urlPrefix: 'http://127.0.0.1:83/arcgis/rest/services',
                    proxyUrl: 'http://112.35.60.89:82/resourceProxy',
                });

                // const fl = new FeatureLayer({
                //     url: 'http://218.3.176.6:6080/arcgis/rest/services/BHTuBan/MS_SL_BHTuBan_201812/MapServer/0',
                //     id: 'bhtb2',
                //     outFields: ['*'],
                //     popupTemplate: template,
                //     title: '202001',
                // });

                const wt = new WebTileLayer({
                    urlTemplate: props.imgLayer.urlTemplate,
                    id: props.imgLayer.id
                })

                setImageLayer(wt);
                props.view.map.add(wt);

                // props.view.map.add(fl);
            })
            .catch(err => console.error(err));

        return function cleanup() {
            props.view.map.remove(imageLayer);
        };
    }, []);

    return null;
};

export default MyImageLayer;
