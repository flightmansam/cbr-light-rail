import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { useSwitch, UseSwitchParameters } from '@mui/base/useSwitch';

export default function Switch(props: UseSwitchParameters) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props);

  const stateClasses = {
    'Switch-checked': checked,
    'Switch-focusVisible': focusVisible,
  };

  return (

    <BasicSwitchRoot className={clsx(stateClasses)}>
        <BasicSwitchInput {...getInputProps()} aria-label="Switch" />
        <BasicSwitchSlider className={clsx(stateClasses)} />
    </BasicSwitchRoot>

  );
}

const BasicSwitchRoot = styled('label')(
      ({ theme }) => `
  /* Variables */
    --switch_width: 2em;
    --switch_height: 1em;
    --thumb_color: #e8e8e8;
    --track_color: #e8e8e8;
    --track_active_color: ${theme.palette.primary.main};
    --outline_color: #000;
    --line_thickness: 2px;
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: var(--switch_width);
    height: var(--switch_height);
`);

const BasicSwitchInput = styled('input')`
    opacity: 0;
    z-index:1;
    width: var(--switch_width);
    height: var(--switch_height);
`;

const BasicSwitchSlider = styled('span')(
      ({ theme }) => `
    & {
        box-sizing: border-box;
        border: var(--line_thickness) solid var(--outline_color);
        position: absolute;
        cursor: pointer;
        top: 2px;
        left: 0;
        right: 0;
        bottom: -2px;
        background-color: var(--track_color);
        transition: .15s;
        border-radius: var(--switch_height);
    }

    &:before {
        box-sizing: border-box;
        position: absolute;
        content: "";
        height: var(--switch_height);
        width: var(--switch_height);
        border: var(--line_thickness) solid var(--outline_color);
        border-radius: 100%;
        left: -2px;
        bottom: -2px;
        background-color: var(--thumb_color);
        transform: translateY(-0.2em);
        box-shadow: 0 0.2em 0 var(--outline_color);
        transition: .15s;
    }
            
    &.Switch-checked {
        background-color: var(--track_active_color);  
        &:before {
            transform: translateX(calc(var(--switch_width) - var(--switch_height))) translateY(-0.2em);
        }  
    }

    &.Switch-focusVisible {
        box-shadow: 0 0 0 2px gray;
    }



`);