import React from 'react';
import { loadModules } from 'esri-loader';

import style from './style.css';

let bookMark=null;

class BookMark extends React.Component {
    constructor(props) {
        super(props);

        this.bookMarkRef = React.createRef();

        this.state = {

        };

    }

    componentDidMount() {
        loadModules(["esri/widgets/Bookmarks"], { css: true })
            .then(([Bookmarks]) => {
                console.log(this.props.view)

                bookMark = new Bookmarks({
                    view: this.props.view,
                    editingEnabled: true,
                    bookmarkCreationOptions: {
                        takeScreenshot: false,
                        captureExtent: false,
                        screenshotSettings: {
                            width: 100,
                            height: 100
                        }
                    },
                    container: this.bookMarkRef.current
                });
                this.props.view.ui.add(bookMark, "top-right");
            })
    }

    componentWillUnmount(){
        this.props.view.ui.remove(bookMark);
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
