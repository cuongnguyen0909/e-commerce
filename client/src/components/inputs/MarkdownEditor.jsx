import React, { memo, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEditor = ({ label, value, changeValue, name, invalidFields, setInvalidFields }) => {
    return (
        <div className='flex flex-col'>
            <span>{label}</span>
            <Editor
                apiKey={process.env.REACT_APP_MCETINY_API_KEY}
                initialValue={value}
                init={{
                    height: 300,
                    menubar: false,
                    // plugins: [
                    //     'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    //     'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    //     'insertdatetime', 'media', 'table', 'preview', 'wordcount'
                    // ],
                    // toolbar: 'undo redo | blocks | ' +
                    //     'bold italic forecolor | alignleft aligncenter ' +
                    //     'alignright alignjustify | bullist numlist outdent indent | ' +
                    //     'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onChange={e => changeValue(prev => ({ ...prev, [name]: e.target.getContent() }))}
                onFocus={() => setInvalidFields && setInvalidFields([])}
            />
            {invalidFields?.some(item => item.name === name) &&
                <small className='text-main text-sm'>{invalidFields?.find(item => item.name === name)?.message}</small>}
        </div>
    );
}
export default memo(MarkdownEditor);