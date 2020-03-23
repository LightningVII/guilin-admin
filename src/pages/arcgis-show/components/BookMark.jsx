import React from 'react';
import { loadModules } from 'esri-loader';

import style from './style.css';

class BookMark extends React.Component {
    constructor(props) {
        super(props);

        this.bookMarkRef = React.createRef();

        this.state = {

        };

    }

    componentDidMount() {

        loadModules([
            'esri/widgets/Bookmarks'
        ]).then(Bookmarks => {
            const bookmarks = new Bookmarks({
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
                container: this.bookMarkRef.current
            });
            this.props.view.ui.add(bookmarks, "top-right");
        });
    }


    render() {
        return (
            <>
                <div ref={this.bookMarkRef} className={style.bookMark} />
            </>
        );
    }
}

export default BookMark;
