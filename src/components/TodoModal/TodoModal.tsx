import React, { useState, useEffect } from 'react';
import { Loader } from '../Loader';
import { showLoader } from '../../services/services';
import { User } from '../../types/User';
import { Todo } from '../../types/Todo';
import { getUser } from '../../api';

type Props = {
  onShowModal: (v: boolean) => void,
  selectedTodo: Todo,
  onSetSelectedTodoId: (v: number) => void,
};

export const TodoModal: React.FC<Props> = ({
  onShowModal,
  selectedTodo,
  onSetSelectedTodoId,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const {
    id,
    title,
    completed,
    userId,
  } = selectedTodo;

  useEffect(() => {
    setIsLoading(true);

    getUser(userId)
      .then((response) => {
        setUser(response);
      })
      .catch((errorMessage) => {
        // eslint-disable-next-line no-console
        console.log(errorMessage);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleCloseModal = () => {
    onShowModal(false);
    onSetSelectedTodoId(0);
  };

  useEffect(() => {
    showLoader(setIsLoading);
  }, []);

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              {`Todo #${id}`}
            </div>

            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={() => handleCloseModal()}
            />
          </header>

          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {title}
            </p>

            <p className="block" data-cy="modal-user">
              {completed
                ? (
                  <strong className="has-text-success">Done</strong>
                ) : (
                  <strong className="has-text-danger">Planned</strong>
                )}
              {' by '}

              <a href={`mailto:${user?.email}`}>
                {user?.name}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
