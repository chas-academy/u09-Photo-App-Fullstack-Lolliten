import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, CircularProgress } from "@mui/material";

const SearchResults = () => {
  const { searchLoading, searchError } = useSelector((state) => state.search);

  if (searchLoading) {
    return <CircularProgress />;
  }

  if (searchError) {
    return <Typography color="error">{searchError}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4">Search Results</Typography>
      {searchResults.length === 0 ? (
        <Typography>No results found...</Typography>
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

export default SearchResults;
