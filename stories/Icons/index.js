import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Markdown from '../utils/Components/Markdown';
import CodeExample from '../utils/Components/CodeExample';
import Readme from '../../src/Icons/README.md';

import AllIcons from './AllIcons';
import AllIconsRaw from '!raw!./AllIcons';

import CustomeIcon from './CustomIcon';
import CustomeIconRaw from '!raw!./CustomIcon';

storiesOf('6. Common', module)
  .add('6.5 Icons', () => (
    <div>
      <Markdown source={Readme}/>

      <CodeExample title="All Icons" code={AllIconsRaw}>
        <AllIcons/>
      </CodeExample>
      <CodeExample title="Custom Icon" code={CustomeIconRaw}>
        <CustomeIcon/>
      </CodeExample>
    </div>
  ));
