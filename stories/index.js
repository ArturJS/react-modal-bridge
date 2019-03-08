import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import { ModalDialog, modal } from '../src';

storiesOf('Welcome', module).add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')} />
));

storiesOf('ModalDialog simple', module).add('with text', () => (
    <div>
        <Button
            onClick={() => {
                modal.confirm({ title: 'Title', body: 'Modal content...' });
            }}>
            Open modal
        </Button>
        <ModalDialog />
    </div>
));
