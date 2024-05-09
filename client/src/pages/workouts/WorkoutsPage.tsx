import { useEffect, useState } from 'react';
import GenericFilters from '../../components/generic-filters/GenericFilters';
import AddButton from '../../UI/add-button/AddButton';
import { createPortal } from 'react-dom';
import WorkoutModal from '../../components/workout-modal/WorkoutModal';
import { useQuery } from '@tanstack/react-query';
import WorkoutCard from '../../components/workout-card/WorkoutCard';
import { WorkoutType } from '../../utils/types/workout.types';
import { getAllWorkoutsFn } from './functions/services';
import './WorkoutPage.scss';
import { useFiltersContext } from '../../store/context/filters-context/filters-context';

const WorkoutsPage = () => {
	const { isLoading, isError, data, error } = useQuery({
		queryKey: ['workouts'],
		queryFn: getAllWorkoutsFn,
	});
	const { textFilter } = useFiltersContext();

	const [showWorkoutModal, setShowWorkoutModal] = useState(false);
	const [isEditWorkoutMode, setIsEditWorkoutMode] = useState(false);
	const [showFavourites, setShowFavourites] = useState(true);
	const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutType[]>([]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			// workouts filter request
			console.log('workout: ' + textFilter);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [textFilter]);

	useEffect(() => {
		const updatedFilteredWorkouts: WorkoutType[] = showFavourites
			? data?.filter((workout: WorkoutType) => workout.favourite)
			: data;
		setFilteredWorkouts(updatedFilteredWorkouts);
	}, [data, showFavourites]);

	const newWorkoutHandler = () => {
		setShowWorkoutModal(true);
		setIsEditWorkoutMode(false);
	};

	return (
		<section className='workouts'>
			<div className='workouts__new'>
				<AddButton text='New workout' onClickHandler={newWorkoutHandler} />
			</div>

			<GenericFilters setShowFavourites={setShowFavourites} showFavourites={showFavourites} />

			<div className='workouts__list'>
				{filteredWorkouts?.map((workout: WorkoutType) => (
					<WorkoutCard
						{...workout}
						key={workout._id}
						setShowWorkoutModal={setShowWorkoutModal}
						setIsEditWorkoutMode={setIsEditWorkoutMode}
					/>
				))}
			</div>

			{createPortal(
				<WorkoutModal
					showModal={showWorkoutModal}
					setShowModal={setShowWorkoutModal}
					isEditMode={isEditWorkoutMode}
				/>,
				document.querySelector('#modal-root')!,
			)}
		</section>
	);
};

export default WorkoutsPage;
