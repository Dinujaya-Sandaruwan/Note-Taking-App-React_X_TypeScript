import { useMemo, useState } from "react";
import {
	Badge,
	Button,
	Card,
	Col,
	Form,
	FormControl,
	Modal,
	Row,
	Stack,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "../App";
// import styles from "../styles/NoteList.modules.css";
import styles from "../styles/NoteList.module.css";

type NodeListProps = {
	availableTags: Tag[];
	notes: Note[];
	onDeleteTag: (id: string) => void;
	onUpdateTag: (id: string, label: string) => void;
};

type SimplifiedNote = {
	tags: Tag[];
	title: string;
	id: string;
};

type EditTagsModelProps = {
	show: boolean;
	availableTags: Tag[];
	handleClose: () => void;
	onDeleteTag: (id: string) => void;
	onUpdateTag: (id: string, label: string) => void;
};

function NoteList({
	availableTags,
	notes,
	onUpdateTag,
	onDeleteTag,
}: NodeListProps) {
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
	const [title, setTitle] = useState("");
	const [editTagsModelIsOpen, setEditTagsModelIsOpen] = useState(false);

	const filteredNotes = useMemo(() => {
		return notes.filter((note) => {
			return (
				(title === "" ||
					note.title.toLowerCase().includes(title.toLowerCase())) &&
				(selectedTags.length === 0 ||
					selectedTags.every((tag) =>
						note.tags.some((noteTag) => noteTag.id === tag.id)
					))
			);
		});
	}, [title, selectedTags, notes]);

	return (
		<>
			<Row className="align-items-center mb-4">
				<Col>
					<h1>Notes</h1>
				</Col>
				<Col xs="auto">
					<Stack gap={2} direction="horizontal">
						<Link to="/new">
							<Button variant="primary">Create</Button>
						</Link>
						<Button
							variant="outline-secondary"
							onClick={() => setEditTagsModelIsOpen(true)}
						>
							Edit Tags
						</Button>
					</Stack>
				</Col>
			</Row>

			<Form>
				<Row className="mb-4">
					<Col>
						<Form.Group controlId="title">
							<Form.Label>Title</Form.Label>
							<FormControl
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group controlId="tags">
							<Form.Label>Tags</Form.Label>
							<ReactSelect
								value={selectedTags.map((tag) => {
									return { label: tag.label, value: tag.id };
								})}
								options={availableTags.map((tag) => {
									return { label: tag.label, value: tag.id };
								})}
								onChange={(tags) => {
									setSelectedTags(
										tags.map((tag) => {
											return { label: tag.label, id: tag.value };
										})
									);
								}}
								isMulti
							/>
						</Form.Group>
					</Col>
				</Row>
			</Form>

			<Row xs={1} sm={2} lg={3} xl={4} className="g-3">
				{filteredNotes.map((note) => (
					<Col key={note.id}>
						<NoteCard id={note.id} title={note.title} tags={note.tags} />
					</Col>
				))}
			</Row>
			<EditTagsModal
				onDeleteTag={onDeleteTag}
				onUpdateTag={onUpdateTag}
				show={editTagsModelIsOpen}
				handleClose={() => setEditTagsModelIsOpen(false)}
				availableTags={availableTags}
			/>
		</>
	);
}

export default NoteList;

function NoteCard({ id, title, tags }: SimplifiedNote) {
	return (
		<Card
			as={Link}
			to={`/${id}`}
			className={`h-100 text-reset text-decoration-none ${styles.card}`}
		>
			<Card.Body>
				<Stack
					gap={2}
					className="align-items-center justify-content-center h-100"
				>
					<span className="fs-5">{title}</span>
					{tags.length > 0 && (
						<Stack
							gap={1}
							direction="horizontal"
							className="justify-content-center flex-wrap"
						>
							{tags.map((tag) => (
								<Badge key={tag.id} className="text-truncate">
									{tag.label}
								</Badge>
							))}
						</Stack>
					)}
				</Stack>
			</Card.Body>
		</Card>
	);
}

function EditTagsModal({
	availableTags,
	show,
	handleClose,
	onDeleteTag,
	onUpdateTag,
}: EditTagsModelProps) {
	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Tags</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Stack gap={2}>
						{availableTags.map((tag) => (
							<Row key={tag.id}>
								<Col>
									<Form.Control
										type="text"
										value={tag.label}
										onChange={(e) => onUpdateTag(tag.id, e.target.value)}
									/>
								</Col>
								<Col xs="auto">
									<Button
										onClick={() => onDeleteTag(tag.id)}
										variant="outline-danger"
									>
										&times;
									</Button>
								</Col>
							</Row>
						))}
					</Stack>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
