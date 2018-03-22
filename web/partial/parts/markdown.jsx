import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

require('./markdown.css');

const styles = {
    root: {
        marginTop: 20,
        marginBottom: 20,
        padding: '0 10px',
    },
};

class MarkdownElement extends Component {
    componentWillMount() {
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code, lang) {
                return require('highlight').highlight(lang, code).value;
            },
        });
    }

    render() {
        const {
      style,
            text,
    } = this.props;

        /* eslint-disable react/no-danger */
        return (
            <div
                style={Object.assign({}, styles.root, style)}
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: marked(text) }}
            />
        );
        /* eslint-enable */
    }
}

export default MarkdownElement;