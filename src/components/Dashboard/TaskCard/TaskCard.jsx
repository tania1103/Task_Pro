/**
 * Card component for displaying a task card
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';

// Helper to get priority color
const getPriorityColor = (priority, theme) => {
  switch (priority) {
    case 'high':
      return theme.palette.custom.highPriority;
    case 'medium':
      return theme.palette.custom.mediumPriority;
    case 'low':
      return theme.palette.custom.lowPriority;
    default:
      return theme.palette.custom.lowPriority;
  }
};

// Format date to display
const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const Card = ({ card, index }) => {
  const dispatch = useDispatch();

  const handleEditCard = (e) => {
    e.stopPropagation();
    // Open edit card modal
    console.log('Edit card clicked', card.id);
  };

  const handleCardClick = () => {
    // Open card details modal
    console.log('Card clicked', card.id);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 6 : 1}
          sx={{
            p: 2,
            mb: 1,
            borderRadius: 2,
            cursor: 'pointer',
            position: 'relative',
            bgcolor: 'custom.cardBackground',
            '&:hover .edit-button': {
              opacity: 1,
            },
            transition: theme => theme.transitions.create(['box-shadow']),
          }}
          onClick={handleCardClick}
        >
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: theme => theme.transitions.create(['opacity']),
          }} className="edit-button">
            <Tooltip title="Edit Card">
              <IconButton size="small" onClick={handleEditCard}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1,
                pr: 4, // Space for edit button
              }}
            >
              {card.title}
            </Typography>

            {card.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {card.description}
              </Typography>
            )}
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Chip
              label={card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.75rem',
                bgcolor: theme => getPriorityColor(card.priority, theme),
                color: '#fff',
              }}
            />

            {card.deadline && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}>
                <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                {formatDate(card.deadline)}
              </Box>
            )}
          </Box>

          {card.labels && card.labels.length > 0 && (
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: 1
            }}>
              {card.labels.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: 'action.selected',
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>
      )}
    </Draggable>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    deadline: PropTypes.string,
    columnId: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default Card;
