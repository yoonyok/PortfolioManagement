import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { skill } from '../styles/skill.scss';
import Button from './Button';
import Table from './Table';
import Dropdown from './Dropdown';
import { COMPETENCY } from '../constants/constants.js';
import PopupBox from './PopupBox';
import PopupBoxForDeletion from './PopupBoxForDeletion';

class EditExistingSkill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deletionModalOpen: false,
            successModalOpen: false,
            errorModalOpen: false,
            userId: this.props.location.state.data[0].Value,
            skills: this.props.location.state.skillsData,
            userSkillIds: this.props.location.state.skillIdsData,
            numSkills: this.props.location.state.skillsData.length,
            editingRows: [],
            editedCompetencies: [],
            checks: [], // array of checks status for every user skill
            numChecked: 0, // number of checks for deleting skills
            errors: {},
            userCompetencies: [],
        };
        this.onCloseDeletion = this.onCloseDeletion.bind(this);
        this.onCloseSuccess = this.onCloseSuccess.bind(this);
        this.onCloseError = this.onCloseError.bind(this);
        this.onCancelDeletion = this.onCancelDeletion.bind(this);
        this.handleMultipleSelects = this.handleMultipleSelects.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
        this.confirmEditing = this.confirmEditing.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.getRows();
    }

    getRows() {
        const tableDataForEdit = [];
        for (let i = 0; i < this.state.numSkills; i++) {
            this.state.userCompetencies.push(Object.values(this.state.skills[i])[2]);
            tableDataForEdit.push({
                'Skill Category': Object.values(this.state.skills[i])[0],
                'Skill Name': Object.values(this.state.skills[i])[1],
                'Competency': Object.values(this.state.skills[i])[2],
                'New Competency': <Dropdown
                                      label=""
                                      name="sC"
                                      data={COMPETENCY}
                                      onSelect={this.handleMultipleSelects}
                                      error={this.state.errors.sC}
                                   />,
                'Remove Skill': <input type="checkbox" onClick={this.handleDelete} />
            });
        }
        this.setState({ editingRows: tableDataForEdit});
    }

    handleMultipleSelects() {
        const competencies = [];
        const updatedCompetencies = [];
        for (let i = 0; i < this.state.numSkills; i++) {
            const skillCompetency = document.getElementsByTagName('select')[i].value;
            competencies.push(skillCompetency);
        }
        for (let i = 0; i < competencies.length; i++) {
            if (competencies[i] === 'Select ... ') {
                updatedCompetencies.push(this.state.userCompetencies[i]);
            } else {
                updatedCompetencies.push(competencies[i]);
            }
        }
        this.state.editedCompetencies = updatedCompetencies;
    }

    handleDelete() {
        let tempNumChecked = 0;
        const tempChecks = [];
        for (let i = 0; i < this.state.numSkills; i++) {
            if (document.getElementsByTagName('input')[i].checked) {
                tempNumChecked++;
                tempChecks.push(1);
            } else {
                tempChecks.push(0);
            }
        }
        this.state.checks = tempChecks;
        this.state.numChecked = tempNumChecked;
    }

    handleEditing() {
        let differenceCount = 0;
        for (let i = 0; i < this.state.userCompetencies.length; i++) {
            if ( this.state.userCompetencies[i] - this.state.editedCompetencies[i] ) {
                differenceCount++;
            }
        }

        if ( differenceCount === 0 && this.state.numChecked === 0 ||
            this.state.editedCompetencies.length === 0 && this.state.numChecked === 0
        ) {
            this.setState({ errorModalOpen: true });
        } else {
            this.setState({deletionModalOpen: true });
        }
    }

    confirmEditing() {
        for (let i = 0; i < this.state.userCompetencies.length; i++) {
            if ( this.state.userCompetencies[i] - this.state.editedCompetencies[i] ) {
                const id = this.state.userSkillIds[i];
                const c = this.state.editedCompetencies[i];
                axios.put('https://methanex-portfolio-management.herokuapp.com/user-skills/' + id, {
                    competency: c
                });
            }
        }

        if (this.state.numChecked !== 0) {
            for (let i = 0; i < this.state.checks.length; i++ ) {
                if ( this.state.checks[i] === 1) {
                    const id = this.state.userSkillIds[i];
                    axios.delete('https://methanex-portfolio-management.herokuapp.com/user-skills/' + id, {
                    });
                }
            }
        }

        this.setState({ successModalOpen: true });
        this.componentDidMount();
    }

    onCloseDeletion() {
        this.confirmEditing();
        window.history.back();
    }

    onCloseSuccess() {
        window.history.back();
    }

    onCloseError() {
        this.setState({ errorModalOpen: false });
    }

    onCancelDeletion() {
        this.setState({ deletionModalOpen: false });
        window.history.back();
    }

    render() {
        const { numSkills, deletionModalOpen, successModalOpen, errorModalOpen } = this.state;
        let editingColumns = ['Skill Category', 'Skill Name', 'Competency', 'New Competency', 'Remove Skill'];
        const data = [{'Value': localStorage.user_id}];
        if (numSkills === 0) {
            if (this.props.location.state.data[0].Value === localStorage.user_id) {
                return(
                   <div className={ skill }>
                        <h4><i>you currently have no skill...</i></h4>
                        <Link to = {{pathname: '/skill/add', state: {data}}}>
                            <Button
                                type="submit"
                                label="Add Skill"
                            />
                        </Link>
                    </div>
                );
            }
        }
        return(
            <div className={ skill }>
                <h1>Editing Skills</h1>
                <PopupBoxForDeletion
                    label="Are you sure about the changes?"
                    isOpen={deletionModalOpen}
                    onClose={this.onCloseDeletion}
                    onCancel={this.onCancelDeletion}
                />
                <PopupBox
                    label="Successful!"
                    isOpen={successModalOpen}
                    onClose={this.onCloseSuccess}
                />
                <PopupBox
                    label="no changes were made"
                    isOpen={errorModalOpen}
                    onClose={this.onCloseError}
                />
                <Table text="List of Skills" columns={editingColumns} rows={this.state.editingRows}/>
                <Button
                    type="submit"
                    label="save changes"
                    onClick={this.handleEditing}
                />
            </div>
        );
    }
}

EditExistingSkill.propTypes = {
    history: React.PropTypes.any,
    location: PropTypes.any,
};

export default EditExistingSkill;
