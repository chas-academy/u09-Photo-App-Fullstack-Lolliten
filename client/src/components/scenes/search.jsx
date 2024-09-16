import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';

export const SearchResults = () => {
  const { searchResults, searchLoading, searchError } = useSelector((state) => state.search);

  if (searchLoading) {
    return <CircularProgress />;
  }

  if (searchError) {
    return <Typography color="error">{searchError}</Typography>;
  }

  // Button to add friend frontend, in backend crud to add friend
  return (
    <Box>
      <Typography variant="h4">Search Results</Typography>
      {searchResults.length === 0 ? (
        <Typography>No results found... Sorry</Typography>
      ) : (
        searchResults.map((user) => (
          <Box key={user._id} mb={2}>
            <Typography>{`${user.firstName} ${user.lastName}`}</Typography>
            <Typography>{user.email}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

//export default SearchResults;