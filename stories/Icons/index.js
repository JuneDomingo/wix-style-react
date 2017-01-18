import React from 'react';
import {storiesOf} from '@kadira/storybook';
import CodeExample from '../utils/Components/CodeExample';

import AllIcons from './AllIcons';
import AllIconsRaw from '!raw!./AllIcons';

import CustomeIcon from './CustomIcon';
import CustomeIconRaw from '!raw!./CustomIcon';

storiesOf('6. Common', module)
  .add('6.5 Icons', () => (
    <div>
      <h1>Icons</h1>
      <CodeExample title="All Icons" code={AllIconsRaw}>
        <AllIcons/>
      </CodeExample>
      <CodeExample title="Custom Icon" code={CustomeIconRaw}>
        <CustomeIcon/>
      </CodeExample>
    </div>
  ));
