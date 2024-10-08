import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { Theme, ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import React from 'react';
import { ClickAwayListener } from '../base/ClickAwayListener';
import { TextField } from '../base/TextField';
import { CloseIcon, SearchIcon } from '../icons';
import TooltipIcon from './TooltipIcon';

const customTheme = (theme: Theme) =>
  createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': theme.palette.border.strong,
            '--TextField-brandBorderHoverColor': theme.palette.background.graphics?.default,
            '--TextField-brandBorderFocusedColor': theme.palette.background.graphics?.default,
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'var(--TextField-brandBorderColor)'
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)'
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      },
      MuiInput: {
        styleOverrides: {
          root: {
            color: theme.palette.text.default,
            '&::before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)'
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)'
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      }
    }
  });

export interface SearchBarProps {
  onSearch: (searchText: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  onClear?: () => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

function SearchBar({
  onSearch,
  placeholder,
  onClear,
  expanded,
  setExpanded,
  onKeyDown
}: SearchBarProps): JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const theme = useTheme();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  const handleClearIconClick = (): void => {
    setSearchText('');
    setExpanded(false);
    if (onClear) {
      onClear();
    }
  };

  const handleSearchIconClick = (): void => {
    if (expanded) {
      setSearchText('');
      setExpanded(false);
    } else {
      setExpanded(true);
      setTimeout(() => {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }, 300);
    }
  };

  // const handleClickAway = (): void => {
  //   if (expanded) {
  //     setExpanded(false);
  //   }
  // };

  return (
    <ClickAwayListener
      onClickAway={(event) => {
        const isTable = (event.target as HTMLElement)?.closest('#ref');

        if (searchText !== '') {
          return;
        }
        if (isTable) {
          handleClearIconClick(); // Close the search bar as needed
        }
      }}
    >
      <div>
        <ThemeProvider theme={customTheme(theme)}>
          <TextField
            variant="standard"
            value={searchText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearchChange(e);
              onSearch(e.target.value);
            }}
            inputRef={searchRef}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            style={{
              width: expanded ? '150px' : '0',
              opacity: expanded ? 1 : 0,
              transition: 'width 0.3s ease, opacity 0.3s ease'
            }}
          />
        </ThemeProvider>
        {expanded ? (
          <TooltipIcon
            title="Close"
            onClick={handleClearIconClick}
            icon={<CloseIcon fill={theme.palette.icon.default} />}
            arrow
          />
        ) : (
          <TooltipIcon
            title="Search"
            onClick={handleSearchIconClick}
            icon={<SearchIcon fill={theme.palette.icon.default} />}
            arrow
          />
        )}
      </div>
    </ClickAwayListener>
  );
}

export default SearchBar;
