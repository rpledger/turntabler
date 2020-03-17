from setuptools import setup, find_packages
from os import path

setup(
    name='turn_data',
    version='0.0.1.dev0',
    packages=find_packages(exclude=['docs', 'tests']),
    install_requires=[
        'flask',
        'flask_sqlalchemy',
        'sqlalchemy_utils'
    ],
    extras_require={
        'dev': [
            'setuptools'
        ],
        'test': ['coverage']
    }
)
