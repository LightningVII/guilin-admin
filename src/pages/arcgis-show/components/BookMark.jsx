import React from 'react';
import { loadModules } from 'esri-loader';

import style from './style.css';

let EsriBookmarks = null;
class BookMark extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        loadModules([
            'esri/widgets/Bookmarks'
        ]).then(Bookmarks => {
            EsriBookmarks = Bookmarks;
            const bookmarks = new EsriBookmarks({
                view: this.props.view,
                // allows bookmarks to be added, edited, or deleted
                editingEnabled: true,
                bookmarkCreationOptions: {
                    takeScreenshot: true,
                    captureExtent: false,
                    screenshotSettings: {
                        width: 100,
                        height: 100
                    }
                },
                // container:'bookMark'
            });
            this.props.view.ui.add(bookmarks, "top-right");
        });
    }

    // componentDidMount() {

    // }


    render() {
        return (
            <>
                <div id='bookMark' className={style.bookMark} />
            </>
        );
    }
}

export default BookMark;
