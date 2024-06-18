import TableHeading from "@/Components/TableHeading";
import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";
import { Pencil, Trash2 } from "lucide-react";

export default function TasksTable({ success, tasks, queryParams = null, hideProjectColumn = false }) {

	queryParams = queryParams || {};
	const searchFieldChanged = (name, value) => {
		if (value) {
			queryParams[name] = value
		} else {
			delete queryParams[name]
		}
		router.get(route('task.index'), queryParams)
	}

	const onKeyPress = (name, e) => {
		if (e.key !== 'Enter')
			return;
		searchFieldChanged(name, e.target.value);

	}

	const sortChanged = (name) => {
		if (name === queryParams.sort_field) {
			if (queryParams.sort_direction === 'asc') {
				queryParams.sort_direction = 'desc'
			} else {
				queryParams.sort_direction = 'asc'
			}
		} else {
			queryParams.sort_field = name
			queryParams.sort_direction = 'asc'
		}
		router.get(route('task.index'), queryParams)
	}

	const deleteTask = (task) => {
		if (!window.confirm("Are you sure you want to delete the task?")) {
			return;
		}
		router.delete(route("task.destroy", task.id));
	};

	return (
		<>

			<div className="overflow-auto rounded-lg">
				<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
						<tr className="text-nowrap text-center">
							<TableHeading
								name='id'
								sortChanged={sortChanged}
								sort_field={queryParams.sort_field}
								sort_direction={queryParams.sort_direction}
							>ID</TableHeading>
							<th className="px-3 py-3">Image</th>
							{!hideProjectColumn && <th className="px-3 py-3">Project Name</th>}
							<TableHeading
								name='name'
								sortChanged={sortChanged}
								sort_field={queryParams.sort_field}
								sort_direction={queryParams.sort_direction}
							>Task Name</TableHeading>
							<TableHeading
								name='status'
								sortChanged={sortChanged}
								sort_field={queryParams.sort_field}
								sort_direction={queryParams.sort_direction}
							>Status</TableHeading>
							<TableHeading
								name='created_at'
								sortChanged={sortChanged}
								sort_field={queryParams.sort_field}
								sort_direction={queryParams.sort_direction}
							>Creation Date</TableHeading>
							<TableHeading
								name='due_date'
								sortChanged={sortChanged}
								sort_field={queryParams.sort_field}
								sort_direction={queryParams.sort_direction}
							>Due Date</TableHeading>
							<th className="px-3 py-3">Created By</th>
							<th className="px-3 py-3">Actions</th>
						</tr>
					</thead>
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
						<tr className="text-nowrap">
							<th className="px-3 py-3"></th>
							<th className="px-3 py-3"></th>
							{!hideProjectColumn && <th className="px-3 py-3"></th>}
							<th className="px-3 py-3">
								<TextInput
									defaultValue={queryParams.name}
									className="w-full "
									placeholder="Task Name"
									onBlur={e => searchFieldChanged('name', e.target.value)}
									onKeyPress={e => onKeyPress('name', e)} />
							</th>
							<th className="px-3 py-3">
								<SelectInput
									defaultValue={queryParams.status}
									className="w-full"
									onChange={e => searchFieldChanged('status', e.target.value)} >
									<option value=''>Select Status</option>
									<option value='pending'>Pending</option>
									<option value='in_progress'>In Progress</option>
									<option value='completed'>Completed</option>
								</SelectInput>
							</th>
							<th className="px-3 py-3"></th>
							<th className="px-3 py-3"></th>
							<th className="px-3 py-3"></th>
							<th className="px-3 py-3"></th>
						</tr>
					</thead>
					<tbody>
						{tasks.data.map(task => (
							<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center" key={task.id}>
								<td className="px-3 py-2" >{task.id}</td>
								<td className="px-3 py-2"><img src={task.image_path} style={{ width: 40, borderRadius: 10 }} alt=""></img></td>
								{!hideProjectColumn && (<td className="px-3 py-2 text-nowrap max-w-48 text-ellipsis overflow-hidden">{task.project.name}</td>)}
								<td className="px-3 py-2 text-gray-100 hover:underline text-nowrap max-w-36 overflow-hidden text-ellipsis">
									<Link
										href={route('task.show', task.id)}>
										{task.name}
									</Link>
								</td>
								<td className="px-3 py-2">
									<span className={"px-2 py-1 rounded text-white " + TASK_STATUS_CLASS_MAP[task.status]}>
										{TASK_STATUS_TEXT_MAP[task.status]}
									</span>
								</td>
								<td className="px-3 py-2">{task.created_at}</td>
								<td className="px-3 py-2">{task.due_date}</td>
								<td className="px-3 py-2">{task.createdBy.name}</td>
								<td className=" px-4 py-6 flex gap-2">
									<Link
										href={route('task.edit', task.id)}
										className="font-medium text-blue-600 dark:text-blue-500 "><Pencil size={18} /></Link>
									<button
										onClick={(e) => deleteTask(task)}
										className="font-medium text-red-600 dark:text-red-500 "><Trash2 size={18} /></button>
								</td>
							</tr>
						))}

					</tbody>
				</table>
			</div>
			<Pagination links={tasks.meta.links} />
		</>
	)
}